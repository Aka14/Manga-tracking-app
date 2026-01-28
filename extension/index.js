chrome.storage.local.get("session", (res) => {
  if (!res.session) {
    window.location.href = "login.html"
    return
  }

  // Get userId once at the top level
  chrome.storage.local.get("userId", (result) => {
    const userId = result.userId;

    async function addCurrent() {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        console.error("No active tab found!");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (userId) => {  // Accept userId as parameter
          const url = window.location.href;
          try {
            const response = await fetch(
              "http://127.0.0.1:8000/api/get-current-link",
              {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({ chapter_link: url, userId: userId }),
              },
            );
            const data = await response.json();
            console.log(data);
          } catch (err) {
            console.log("Fetch error", err);
          }
        },
        args: [userId]  // Pass userId here
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
        func: async (userId) => {  // Accept userId as parameter
          const url = window.location.href;
          try {
            const response = await fetch(
              "http://127.0.0.1:8000/api/get-re-read-link",
              {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({ chapter_link: url, userId: userId }),
              },
            );
            const data = await response.json();
            console.log(data);
          } catch (err) {
            console.log("Fetch error", err);
          }
        },
        args: [userId]  // Pass userId here
      });
    }

    document.getElementById("addCurrent").addEventListener("click", addCurrent);
    document.getElementById("addReRead").addEventListener("click", addReRead);
  });
});