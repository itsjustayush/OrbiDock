// OrbiDock Browser Extension - Service Worker (Background)
// Communicates in real-time with the OrbiDock Tauri Desktop App via 127.0.0.1:49821

const WEBSOCKET_URL = "ws://127.0.0.1:49821";
const RECONNECT_INTERVAL_MS = 3000;

let socket = null;
let isConnected = false;
let currentFocusSession = null; // { active: bool, agenda: string, allowedUrls: [], disallowedUrls: [] }
let dynamicReminderConfig = {
  smartDynamicMode: true,
  baseIntervalMinutes: 30,
  lastWaterReminder: Date.now(),
  stressScore: 0.2
};

// --- WEBSOCKET CLIENT ---
function initWebSocket() {
  try {
    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      isConnected = true;
      console.log("[OrbiDock Extension] Connected to desktop notch at", WEBSOCKET_URL);
      sendToNotch("extension:connected", {
        agent: navigator.userAgent,
        timestamp: Date.now()
      });
      // Sync initial tab
      queryActiveTab();
      checkIncognitoAccess();
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleNotchMessage(message);
      } catch (err) {
        console.error("[OrbiDock Extension] Error parsing incoming WS payload:", err);
      }
    };

    socket.onclose = () => {
      isConnected = false;
      console.warn("[OrbiDock Extension] WebSocket disconnected. Retrying in", RECONNECT_INTERVAL_MS, "ms...");
      setTimeout(initWebSocket, RECONNECT_INTERVAL_MS);
    };

    socket.onerror = (err) => {
      console.error("[OrbiDock Extension] WebSocket error:", err);
      try { socket.close(); } catch (_) {}
    };
  } catch (err) {
    console.error("[OrbiDock Extension] Failed to create WebSocket connection:", err);
    setTimeout(initWebSocket, RECONNECT_INTERVAL_MS);
  }
}

// Send structured message to Tauri Rust Notch
function sendToNotch(type, payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
  }
}

// Handle messages sent from OrbiDock Desktop App
function handleNotchMessage(msg) {
  const { type, payload } = msg;
  console.log("[OrbiDock Extension] Received from Notch:", type, payload);

  switch (type) {
    case "notch:focus_start":
      startFocusBlock(payload);
      break;

    case "notch:focus_stop":
      stopFocusBlock();
      break;

    case "notch:update_agenda":
      if (currentFocusSession) {
        currentFocusSession.agenda = payload.agenda;
        chrome.storage.local.set({ focusSession: currentFocusSession });
      }
      break;

    case "notch:stress_update":
      if (payload && typeof payload.stressScore === "number") {
        dynamicReminderConfig.stressScore = payload.stressScore;
        recalculateDynamicTimer();
      }
      break;

    case "notch:quick_reply":
      forwardQuickReplyToTab(payload);
      break;

    default:
      console.log("[OrbiDock Extension] Unhandled command:", type);
  }
}

// --- FOCUS BLOCK & DECLARATIVE NET REQUEST ---
async function startFocusBlock(config) {
  currentFocusSession = {
    active: true,
    agenda: config.agenda || "Deep Work Session",
    allowedUrls: config.allowedUrls || ["github.com", "stackoverflow.com", "google.com", "docs.rs"],
    disallowedUrls: config.disallowedUrls || [
      "*://*.twitter.com/*",
      "*://*.x.com/*",
      "*://*.instagram.com/*",
      "*://*.facebook.com/*",
      "*://*.reddit.com/*",
      "*://*.youtube.com/shorts*",
      "*://*.tiktok.com/*",
      "*://*.netflix.com/*"
    ]
  };

  await chrome.storage.local.set({ focusSession: currentFocusSession });

  // Update dynamic declarativeNetRequest rules
  const rules = currentFocusSession.disallowedUrls.map((urlFilter, index) => {
    return {
      id: 1000 + index,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          url: chrome.runtime.getURL("blocked.html") + "?agenda=" + encodeURIComponent(currentFocusSession.agenda)
        }
      },
      condition: {
        urlFilter: urlFilter,
        resourceTypes: ["main_frame"]
      }
    };
  });

  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: rules
    });
    console.log("[OrbiDock Focus] Active. Applied", rules.length, "blocking rules.");
  } catch (err) {
    console.error("[OrbiDock Focus] Failed to register declarativeNetRequest rules:", err);
  }

  // Check current open tabs and redirect any already on disallowed sites
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.url && isUrlBlocked(tab.url)) {
        chrome.tabs.update(tab.id, {
          url: chrome.runtime.getURL("blocked.html") + "?agenda=" + encodeURIComponent(currentFocusSession.agenda)
        });
      }
    }
  });

  sendToNotch("extension:focus_status", { status: "started", agenda: currentFocusSession.agenda });
}

async function stopFocusBlock() {
  currentFocusSession = null;
  await chrome.storage.local.remove("focusSession");

  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: []
    });
    console.log("[OrbiDock Focus] Deactivated. All rules cleared.");
  } catch (err) {
    console.error("[OrbiDock Focus] Error clearing rules:", err);
  }

  sendToNotch("extension:focus_status", { status: "stopped" });
}

function isUrlBlocked(url) {
  if (!currentFocusSession || !currentFocusSession.active) return false;
  const lower = url.toLowerCase();
  for (const pattern of currentFocusSession.disallowedUrls) {
    const cleanPattern = pattern.replace(/\*/g, "").replace(/^.*:\/\//, "");
    if (lower.includes(cleanPattern.split("/")[0])) {
      return true;
    }
  }
  return false;
}

// --- DYNAMIC WATER REMINDER ---
function recalculateDynamicTimer() {
  if (!dynamicReminderConfig.smartDynamicMode) return;

  // Formula: Effective Interval = Base * (1.0 - 0.5 * StressScore)
  // At stress 0.0 -> 30 mins; at high stress 1.0 -> 15 mins (hydration urgently needed under heavy stress)
  const baseMinutes = dynamicReminderConfig.baseIntervalMinutes;
  const factor = 1.0 - (0.5 * Math.max(0, Math.min(1, dynamicReminderConfig.stressScore)));
  const effectiveMinutes = Math.round(baseMinutes * factor);

  chrome.alarms.create("dynamic_water_reminder", {
    delayInMinutes: effectiveMinutes
  });
  console.log(`[OrbiDock Hydration] Dynamic interval updated to ${effectiveMinutes} mins (Stress: ${(dynamicReminderConfig.stressScore * 100).toFixed(0)}%)`);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dynamic_water_reminder") {
    sendToNotch("browser:water_reminder_due", {
      stressScore: dynamicReminderConfig.stressScore,
      intervalUsed: dynamicReminderConfig.baseIntervalMinutes,
      timestamp: Date.now()
    });

    // Also trigger chrome notification
    chrome.notifications.create("water_reminder", {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "OrbiDock • Hydration Needed",
      message: `Work stress is at ${(dynamicReminderConfig.stressScore * 100).toFixed(0)}%. Take a breath and drink a glass of water.`
    });

    recalculateDynamicTimer();
  }
});

// --- INCOGNITO ENFORCEMENT ---
async function checkIncognitoAccess() {
  chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
    sendToNotch("browser:incognito_capability", {
      isAllowedIncognito: isAllowed
    });
    if (!isAllowed) {
      console.warn("[OrbiDock] Incognito access not enabled for this extension yet.");
    }
  });
}

// --- TAB MONITORING & TELEMETRY ---
function queryActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      broadcastTab(tabs[0]);
    }
  });
}

function broadcastTab(tab) {
  if (!tab.url || tab.url.startsWith("chrome://")) return;
  try {
    const urlObj = new URL(tab.url);
    sendToNotch("browser:tab_changed", {
      url: tab.url,
      domain: urlObj.hostname,
      title: tab.title || "",
      isIncognito: tab.incognito,
      tabId: tab.id
    });
  } catch (_) {}
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab) broadcastTab(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    broadcastTab(tab);
  }
});

// Forward messages from content script to desktop notch
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TELEMETRY_SAMPLE") {
    sendToNotch("browser:stress_sample", message.payload);
    sendResponse({ ok: true });
  } else if (message.type === "SOCIAL_EVENT") {
    // WhatsApp, Discord, or AI streaming notification
    sendToNotch("browser:social_event", message.payload);
    sendResponse({ ok: true });
  } else if (message.type === "MEDIA_STATUS") {
    sendToNotch("browser:media_sync", message.payload);
    sendResponse({ ok: true });
  } else if (message.type === "GET_CONNECTION_STATE") {
    sendResponse({ isConnected, currentFocusSession, dynamicReminderConfig });
  }
  return true;
});

function forwardQuickReplyToTab(payload) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "NOTCH_QUICK_REPLY",
        payload
      });
    }
  });
}

// Initialize on service worker startup
initWebSocket();
recalculateDynamicTimer();
