// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const SERVER_URL = "https://1a0a-81-180-65-42.eu.ngrok.io/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
};

self.addEventListener("install", async () => {
  // This will be called only once when the service worker is installed for first time.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BOAy53ijVrqnl09ho7ZbiGn13Kl5DG2E4epZTFChuPqferYbv1CwTMjhQf5e6wyyQpXRwkHWlH3A9PRY0bLJMBs"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function(event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
  } else {
    console.log("Push event but no data");
  }
});
