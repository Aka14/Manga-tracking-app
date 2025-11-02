import { useState, useEffect } from 'react';
import './App.css';
import { APP_BASE_URL } from '/config.js'; // Make sure this points to http://localhost:8000/

function App() {
  const [mangaData, setMangaData] = useState(null);

  useEffect(() => {
    fetch(APP_BASE_URL)
      .then((response) => response.json())
      .then((data) => setMangaData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white flex-col gap-4">
      <h1 className="text-4xl font-bold text-blue-500">Tailwind Works! 🎉</h1>
      {mangaData ? (
        <h1 className="text-2xl text-green-400">{mangaData.Hello}</h1>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
