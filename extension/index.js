async function sayHello() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    console.error("No active tab found!");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const tab1 = window.location.href;
      let chapter = tab1.replace(/^https?:\/\//, '');      
      console.log(chapter);
    },
  });
}
document.getElementById("addManga").addEventListener("click", sayHello);
