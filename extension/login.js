document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");
  const errorEl = document.getElementById("error");
    

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("1yoyo");
    try {
      // Supabase REST login
      const res = await fetch("https://rwljtpxwkrwlhblvrfkv.supabase.co/auth/v1/token?grant_type=password", {
        method: "POST",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bGp0cHh3a3J3bGhibHZyZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjExODIsImV4cCI6MjA4MTM5NzE4Mn0.QyyMt_SZ1QpC9XPGbhtPST4InzgHYzWbqckhAui0ZsI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          grant_type: "password"
        })
      });

      const data = await res.json();
      console.log(email);
      console.log(password);
      console.log(data);

      if (!data.access_token) {
        errorEl.innerText =
          data.error_description || data.error || "Login failed";
        return;
      }

      const userId = data.user?.id;


      // Save session in chrome.storage
      chrome.storage.local.set({ session: data, userId: userId }, () => {
        window.location.href = "index.html";
        console.log("yoyo")
      });

    } catch (err) {
      errorEl.innerText = err.message;
    }
  });
});
