async function addCurrent() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    console.error("No active tab found!");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const url = window.location.href;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-current-link",
          {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({ chapter_link: url }),
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log("Fetch error", err);
      }
    },
  });
}

async function addReRead() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    console.error("No active tab found!");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const url = window.location.href;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-re-read-link",
          {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({ chapter_link: url }),
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log("Fetch error", err);
      }
    },
  });
}
document.getElementById("addCurrent").addEventListener("click", addCurrent);
document.getElementById("addReRead").addEventListener("click", addReRead);
