import { useState, useEffect } from "react";
import Card from "../components/card.jsx";
import { createClient } from "@supabase/supabase-js";
import { API_URL } from "../config/index.js";

const supabase = createClient(
  "https://rwljtpxwkrwlhblvrfkv.supabase.co",
  "sb_publishable_DUtOZlMRIusJ-Wknan_Q6w_Z3uOnDVv",
);

export default function SavedManga({ data }) {
  console.log("hello");
  console.log("data", data);
  const [mangaList, setMangaList] = useState(data || []);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    manga: null,
    confirming: false,
  });

  const handleDelete = async (manga) => {
    const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.log("No active session");
          setLoading(false);
          return;
        }
    const token = session.access_token;
    console.log("Deleting manga:", manga);
    
    try {
      // Get the auth token (adjust this based on how you store your token)
      console.log("Token exists:", !!token);
      console.log("Token:", token);
      
      if (!token) {
        console.error("No auth token found!");
        // Still try to delete from UI
        // setMangaList((prev) => prev.filter((m) => m.name !== manga.name));
        // setContextMenu({ visible: false, x: 0, y: 0, manga: null, confirming: false });
        return;
      }
      
      console.log(`Calling API at ${API_URL}/remove-manga`);
      const response = await fetch(`${API_URL}remove-manga`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manga_name: manga.name,
          db_name: "saved_manga",
          userId: session.user.id
        })
      });
      console.log("Response body:", response.body);
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        // Only update UI if backend deletion was successful
        setMangaList((prev) => prev.filter((m) => m.name !== manga.name));
        console.log("Manga deleted successfully");
      } else {
        console.error("Failed to delete manga:", result);
      }
    } catch (error) {
      console.error("Error deleting manga:", error);
    }
    
    // Close the context menu regardless
    setContextMenu({ visible: false, x: 0, y: 0, manga: null, confirming: false });
  };


  // Show menu
  const handleRightClick = (e, manga) => {
    e.preventDefault();
    console.log("Right click detected!", manga);
    setContextMenu({
      visible: true,
      x: e.clientX - 580,
      y: e.clientY - 130,
      manga,
      confirming: false,
    });
  };

  // Hide menu on click anywhere else
  const handleClickAnywhere = (e) => {
    console.log("Click anywhere", contextMenu.visible);
    if (contextMenu.visible) {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        manga: null,
        confirming: false,
      });
    }
  };

  return (
    <div onClick={handleClickAnywhere} className="relative min-h-screen p-4">
      <div className="grid grid-flow-row grid-cols-5 gap-2">
        {mangaList.map((manga, index) => (
          <Card
            key={index}
            manga_name={manga.name}
            cover={manga.cover_link}
            current_chapter={"Chapter " + manga.current_chapter}
            chapter_url={manga.chapter_url}
            onRightClick={(e) => handleRightClick(e, manga)}
          />
        ))}
      </div>
      {contextMenu.visible && (
        <div
          className="absolute bg-gray-800  rounded-md z-50 w-36"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {!contextMenu.confirming ? (
            <button
              className="px-4 py-2 hover:bg-red-500 hover:text-black w-full text-left rounded-md text-white"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation here too
                setContextMenu((prev) => ({ ...prev, confirming: true }));
              }}
            >
              Remove Manga
            </button>
          ) : (
            <div className="flex flex-col p-2">
              <span className="text-sm mb-2">
                Are you sure you want to remove{" "}
                <span className="font-bold">{contextMenu.manga?.name}</span>{" "}
                from saved manga?
              </span>{" "}
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-1 bg-red-600 text-white rounded"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleDelete(contextMenu.manga);
                  }}
                >
                  Yes
                </button>
                <button
                  className="flex-1 px-2 py-1 bg-blue-600 rounded"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    setContextMenu({
                      visible: false,
                      x: 0,
                      y: 0,
                      manga: null,
                      confirming: false,
                    });
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
