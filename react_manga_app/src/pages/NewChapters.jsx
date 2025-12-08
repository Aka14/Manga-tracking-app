import { use } from "react";
import Card from "../components/card.jsx";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NewChapters({ data }) {
  const mangaList = data || [];
  console.log(mangaList);

  return (
    <div className="grid grid-flow-row grid-cols-5 gap-2">
      {mangaList.map((manga, index) => (
        <Card
          key={index}
          manga_name={manga.title}
          cover={manga.cover_link}
          current_chapter={"Chapter " + manga.latest_chapter}
          chapter_url={manga.chapter_url}
        />
      ))}
    </div>
  );
}
