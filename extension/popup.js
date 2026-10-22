// Logic for popup.html

document.addEventListener("DOMContentLoaded", () => {
  const connBadge = document.getElementById("conn-badge");
  const connText = document.getElementById("conn-text");
  const stressPct = document.getElementById("stress-percentage");
  const stressLabel = document.getElementById("stress-label");
  const stressBar = document.getElementById("stress-bar");
  const agendaInput = document.getElementById("agenda-input");
  const btnFocus = document.getElementById("btn-focus");
  const incognitoMsg = document.getElementById("incognito-msg");

  // Query background service worker
  chrome.runtime.sendMessage({ type: "GET_CONNECTION_STATE" }, (res) => {
    if (res) {
      if (res.isConnected) {
        connBadge.classList.remove("disconnected");
        connText.textContent = "Connected (49821)";
      } else {
        connBadge.classList.add("disconnected");
        connText.textContent = "Desktop Offline";
      }

      if (res.dynamicReminderConfig) {
        const stress = res.dynamicReminderConfig.stressScore || 0.35;
        const pct = Math.round(stress * 100);
        stressPct.textContent = `${pct}%`;
        stressBar.style.width = `${pct}%`;

        if (pct < 30) stressLabel.textContent = "Calm / Low Load";
        else if (pct < 60) stressLabel.textContent = "Moderate Focus";
        else if (pct < 85) stressLabel.textContent = "High Velocity";
        else stressLabel.textContent = "Extreme Workload";
      }

      if (res.currentFocusSession && res.currentFocusSession.active) {
        btnFocus.textContent = "Stop Focus Lock";
        btnFocus.classList.add("active");
        agendaInput.value = res.currentFocusSession.agenda || "";
        agendaInput.disabled = true;
      }
    }
  });

  // Check incognito access
  chrome.extension.isAllowedIncognitoAccess((allowed) => {
    if (!allowed) {
      incognitoMsg.textContent = "Incognito access disabled in chrome://extensions";
      incognitoMsg.style.color = "#ef4444";
    }
  });

  // Toggle Focus Button
  btnFocus.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "GET_CONNECTION_STATE" }, (res) => {
      const isCurrentlyActive = res?.currentFocusSession?.active;
      if (isCurrentlyActive) {
        // Stop
        chrome.storage.local.get("focusSession", () => {
          chrome.runtime.getBackgroundPage?.(); // trigger
          // Dispatch stop
          chrome.runtime.sendMessage({
            type: "SOCIAL_EVENT",
            payload: { source: "focus_ctrl", action: "stop" }
          });
        });
        btnFocus.textContent = "Start Focus Lock";
        btnFocus.classList.remove("active");
        agendaInput.disabled = false;
      } else {
        // Start
        const agenda = agendaInput.value.trim() || "Deep Work Session";
        btnFocus.textContent = "Stop Focus Lock";
        btnFocus.classList.add("active");
        agendaInput.disabled = true;

        // Save and activate via background
        chrome.storage.local.set({
          focusSession: {
            active: true,
            agenda,
            allowedUrls: ["github.com", "stackoverflow.com", "google.com", "docs.rs"],
            disallowedUrls: [
              "*://*.twitter.com/*",
              "*://*.x.com/*",
              "*://*.instagram.com/*",
              "*://*.facebook.com/*",
              "*://*.reddit.com/*",
              "*://*.youtube.com/shorts*",
              "*://*.tiktok.com/*",
              "*://*.netflix.com/*"
            ]
          }
        });
      }
    });
  });
});
