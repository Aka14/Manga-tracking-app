import { useState, useEffect } from "react";
import Card from "../components/card.jsx";
import { useLocation } from "react-router-dom";

export default function SavedManga() {
  const location = useLocation();
  const data = location.state?.data || [];
  console.log('data', data)
  const mangaList = data?.saved_manga || [];
  console.log(mangaList)

  return (
    <div className="grid grid-flow-row grid-cols-5 gap-2">
      {mangaList.map((manga, index) => (
        <Card
          key={index}
          manga_name={manga.title}
          cover={manga.cover_link}
          current_chapter={"Chapter " + manga.current_chapter}
          chapter_url={manga.chapter_url}
        />
      ))}
    </div>
  );
}
