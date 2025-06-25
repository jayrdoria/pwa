let deferredPrompt;

// Detect standalone mode (already installed)
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

// Check if user has already seen the banner or modal
const alreadyHandled = localStorage.getItem("x7_installed") === "true";

// Detect platform
const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isMac = /macintosh/.test(navigator.userAgent.toLowerCase());
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isInStandalone = window.navigator.standalone === true;
const hasSeenIosModal = localStorage.getItem("x7_ios_modal") === "true";

// Show iOS/macOS instruction modal
if ((isIos || isMac) && isSafari && !isInStandalone && !hasSeenIosModal) {
  const modal = document.getElementById("ios-modal");
  const message = document.getElementById("ios-message");

  if (isIos) {
    message.innerText =
      'To install PWA on mobile, you need to click Share Icon and "Add to Home Screen" to add an icon to your device.';
  } else {
    message.innerText =
      'To install PWA on desktop, you need to click Share or Settings icon and "Add to deck" to add an icon to your desktop.';
  }

  modal.style.display = "flex";

  document.getElementById("ios-ok-btn").addEventListener("click", () => {
    modal.style.display = "none";
    localStorage.setItem("x7_ios_modal", "true");
  });
}

// Show install banner if not installed and not dismissed
if (!isStandalone && !alreadyHandled) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("install-banner").style.display = "flex";
  });
} else {
  document.getElementById("install-banner").style.display = "none";
}

// Handle INSTALL
document.getElementById("install-btn").addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("User installed the app");
      localStorage.setItem("x7_installed", "true");
    }

    deferredPrompt = null;
    document.getElementById("install-banner").style.display = "none";
  }
});

// Handle DISMISS
document.getElementById("dismiss-btn").addEventListener("click", () => {
  document.getElementById("install-banner").style.display = "none";
  localStorage.setItem("x7_installed", "true");
});
