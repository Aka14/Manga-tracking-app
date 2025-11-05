import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/card.jsx";
import Navbar from "./components/navbar.jsx";
import { Route, Routes } from "react-router-dom";
import NewChapters from "./pages/NewChapters.jsx";
import SavedManga from "./pages/savedManga.jsx";
import ReReads from "./pages/reReads.jsx";
import { API_URL } from "./config/index.js";

function App() {
  const [newChapters, setNewChapters] = useState(null);

  useEffect(() => {
    async function fetchNewChapters() {
      try {
        const response = await fetch(`${API_URL}get-new-chapters`);
        const data = await response.json();
        setNewChapters(data.new_chapters || []);
      } catch (err) {
        console.error("Failed to fetch new chapters:", err);
      }
    }

    fetchNewChapters();
  }, []);

  return (
    <div className=" min-h-screen pt-15 px-10">
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/new-chapters"
            element={<NewChapters data={newChapters} />}
          />
          <Route path="/saved-manga" element={<SavedManga />} />
          <Route path="/re-reads" element={<ReReads />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
