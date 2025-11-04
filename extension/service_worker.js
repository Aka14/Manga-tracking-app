chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const blocked = [
    "chrome://",
    "edge://",
    "about:",
    "devtools://",
    "chrome-extension://",
  ];
  if (blocked.some((scheme) => tab.url.startsWith(scheme))) return;

  if (tab.url.includes("mangapill.com/chapters/")) {
    chrome.action.setPopup({ tabId, popup: "index.html" });
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => console.log("Extension active on:", window.location.href),
    });
  } else {
    chrome.action.setPopup({ tabId, popup: "" });
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (!tab.url) return;

  if (tab.url.includes("mangapill.com/chapters/")) {
    chrome.action.setPopup({ tabId: tab.id, popup: "index.html" });
  } else {
    chrome.action.setPopup({ tabId: tab.id, popup: "" });
  }
});
