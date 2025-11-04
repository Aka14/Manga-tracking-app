import React from "react";

const Card = ({ manga_name, manga_image, current_chapter }) => {
  return (
    <div className="w-[200px] flex flex-col gap-4 max-w-sm overflow-hidden mt-auto">
      <div>
        <p className="font-bold text-xl">{manga_name}</p>
        <p className="text-md">{current_chapter}</p>
      <img
        className="rounded-2xl py-2"
        src={manga_image}
        alt={`Cover image for ${manga_name}`}
      />
      </div>
    </div>
  );
};

export default Card;
