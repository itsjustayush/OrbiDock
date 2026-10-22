// OrbiDock Content Script
// Injected into web pages to observe telemetry, social apps (WhatsApp, Discord),
// AI platforms (ChatGPT, Gemini), and web media players.

(function () {
  "use strict";

  const HOST = window.location.hostname;

  // --- 1. PRIVACY-PRESERVING WORKLOAD & STRESS TELEMETRY ---
  let keystrokeCount = 0;
  let mouseDistancePx = 0;
  let lastMousePos = { x: 0, y: 0 };
  let scrollDelta = 0;

  window.addEventListener("keydown", () => {
    keystrokeCount++;
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    if (lastMousePos.x !== 0 && lastMousePos.y !== 0) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      mouseDistancePx += Math.sqrt(dx * dx + dy * dy);
    }
    lastMousePos = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  window.addEventListener("wheel", (e) => {
    scrollDelta += Math.abs(e.deltaY);
  }, { passive: true });

  // Flush telemetry sample every 10 seconds
  setInterval(() => {
    if (document.hidden) return; // Do not record when tab is inactive

    const sample = {
      domain: HOST,
      keystrokeRatePerMin: Math.round(keystrokeCount * 6),
      mouseMovementVelocity: Math.round(mouseDistancePx / 10),
      scrollVelocity: Math.round(scrollDelta / 10),
      timestamp: Date.now()
    };

    // Reset counters
    keystrokeCount = 0;
    mouseDistancePx = 0;
    scrollDelta = 0;

    try {
      chrome.runtime.sendMessage({
        type: "TELEMETRY_SAMPLE",
        payload: sample
      });
    } catch (_) {}
  }, 10000);

  // --- 2. WHATSAPP WEB OBSERVER ---
  if (HOST.includes("web.whatsapp.com")) {
    console.log("[OrbiDock] WhatsApp Web observer attached.");

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for incoming message toast / unread badge
            const unreadBadge = node.querySelector?.('[aria-label*="unread"]') || node.querySelector?.('.unread-count');
            const incomingMsg = node.querySelector?.('.message-in');
            if (incomingMsg) {
              const textEl = incomingMsg.querySelector('.selectable-text');
              const text = textEl ? textEl.innerText : "New message";
              chrome.runtime.sendMessage({
                type: "SOCIAL_EVENT",
                payload: {
                  source: "whatsapp",
                  sender: "WhatsApp Contact",
                  preview: text.slice(0, 100),
                  requiresAttention: false,
                  timestamp: Date.now()
                }
              });
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- 3. DISCORD WEB OBSERVER ---
  if (HOST.includes("discord.com")) {
    console.log("[OrbiDock] Discord Web observer attached.");

    const discordObserver = new MutationObserver(() => {
      // Check for incoming call ring modal
      const callModal = document.querySelector('[class*="incomingCallInner"]');
      if (callModal) {
        const callerName = callModal.querySelector('h2, h3')?.innerText || "Incoming Call";
        chrome.runtime.sendMessage({
          type: "SOCIAL_EVENT",
          payload: {
            source: "discord",
            sender: callerName,
            preview: "Incoming Voice/Video Call",
            requiresAttention: true,
            timestamp: Date.now()
          }
        });
      }
    });

    discordObserver.observe(document.body, { childList: true, subtree: true });
  }

  // --- 4. AI WEB TABS OBSERVER (ChatGPT, Gemini, Claude) ---
  if (HOST.includes("chatgpt.com") || HOST.includes("gemini.google.com") || HOST.includes("claude.ai")) {
    console.log("[OrbiDock] AI Web Platform observer attached for:", HOST);

    let isStreaming = false;
    const aiObserver = new MutationObserver(() => {
      const stopBtn = document.querySelector('button[aria-label="Stop generating"], button[data-testid="stop-button"], .stop-button');
      if (stopBtn && !isStreaming) {
        isStreaming = true;
      } else if (!stopBtn && isStreaming) {
        // Generation finished!
        isStreaming = false;
        // Grab the last assistant message
        const responseEls = document.querySelectorAll('[data-message-author-role="assistant"], .markdown, .model-response-text');
        const lastEl = responseEls[responseEls.length - 1];
        const previewText = lastEl ? lastEl.innerText.slice(0, 160) : "Response finished generating.";

        chrome.runtime.sendMessage({
          type: "SOCIAL_EVENT",
          payload: {
            source: HOST.includes("gemini") ? "gemini" : (HOST.includes("claude") ? "claude" : "chatgpt"),
            sender: "AI Companion",
            preview: previewText,
            requiresAttention: false,
            timestamp: Date.now()
          }
        });
      }
    });

    aiObserver.observe(document.body, { childList: true, subtree: true });
  }

  // --- 5. WEB MEDIA STREAMING OBSERVER (YouTube, Spotify Web, SoundCloud) ---
  if (HOST.includes("youtube.com") || HOST.includes("spotify.com") || HOST.includes("soundcloud.com")) {
    setInterval(() => {
      const media = document.querySelector("video, audio");
      if (media && !media.paused) {
        let title = document.title.replace(" - YouTube", "").replace(" | Spotify", "");
        let artist = HOST.includes("youtube") ? "YouTube Music" : "Web Player";

        chrome.runtime.sendMessage({
          type: "MEDIA_STATUS",
          payload: {
            platform: HOST,
            title: title.slice(0, 60),
            artist: artist,
            isPlaying: !media.paused,
            currentTime: Math.floor(media.currentTime),
            duration: Math.floor(media.duration || 0)
          }
        });
      }
    }, 2000);
  }

  // --- 6. NOTCH QUICK REPLY HANDLER ---
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "NOTCH_QUICK_REPLY" && msg.payload?.replyText) {
      if (HOST.includes("web.whatsapp.com")) {
        const input = document.querySelector('div[contenteditable="true"][data-tab="10"]');
        if (input) {
          input.focus();
          document.execCommand("insertText", false, msg.payload.replyText);
          const enterEvent = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: 13 });
          input.dispatchEvent(enterEvent);
        }
      }
    }
  });

})();
