import { useEffect, useState } from "react";

// We need to type the custom event because TypeScript doesn't know about it
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Listen for the install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Stop the browser from showing it automatically (we'll do it!)
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true); // Show our custom banner
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Hide the banner if the app is already installed
    window.addEventListener("appinstalled", () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    
    // Trigger the native browser popup
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  }

  if (!showBanner) return null;

  return (
    <div className="install-banner">
      <div className="install-text">
        <strong>Install Marketplace</strong>
        <span>Add to your home screen for quick access</span>
      </div>
      <div className="install-actions">
        <button className="btn-dismiss" onClick={() => setShowBanner(false)}>
          Not now
        </button>
        <button className="btn-install" onClick={handleInstallClick}>
          Install
        </button>
      </div>
    </div>
  );
}