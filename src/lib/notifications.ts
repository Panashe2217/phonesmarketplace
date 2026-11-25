export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function showEcoCashNotification(amount: number) {
  if (Notification.permission === "granted") {
    // This creates a notification outside the browser window
    const notification = new Notification("EcoCash Payment Request", {
      body: `Pay $${amount} to Marketplace Zim?\nEnter your PIN in the app to authorize.`,
      icon: "/pwa-192x192.png", // Our PWA icon
      requireInteraction: true, // Keeps it on screen until clicked
      tag: "ecocash-payment", // Groups notifications
    });

    // Focus the window when the user clicks the notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}