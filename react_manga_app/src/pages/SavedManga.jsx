import { useState, useEffect } from "react";
import Card from "../components/card.jsx";

export default function SavedManga({ data }) {
  console.log("hello")
  console.log('data', data)
  const mangaList = data || [];
  console.log('mangaList', mangaList)

  return (
    <div className="grid grid-flow-row grid-cols-5 gap-2">
      {mangaList.map((manga, index) => (
        <Card
          key={index}
          manga_name={manga.name}
          cover={manga.cover_link}
          current_chapter={"Chapter " + manga.current_chapter}
          chapter_url={manga.chapter_url}
        />
      ))}
    </div>
  );
}