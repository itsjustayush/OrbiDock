// Logic for blocked.html

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const agenda = params.get("agenda");
  if (agenda) {
    document.getElementById("agenda-display").textContent = decodeURIComponent(agenda);
  }

  document.getElementById("btn-back").addEventListener("click", () => {
    // Navigate back in history, or to google/github if empty
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "https://github.com";
    }
  });

  document.getElementById("btn-break").addEventListener("click", () => {
    // Notify extension to grant a temporary 5-min grace period
    chrome.runtime.sendMessage({
      type: "SOCIAL_EVENT",
      payload: {
        source: "focus_break",
        sender: "Focus Engine",
        preview: "User requested a 5-minute break.",
        timestamp: Date.now()
      }
    });

    alert("Break request sent to OrbiDock Notch! Take 5 minutes to hydrate and relax.");
  });
});
