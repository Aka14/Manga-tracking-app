import Card from "../components/card.jsx";

export default function NewChapters({ data }) {
  const mangaList = data || [];
  const datanew = location.state?.data || [];

  console.log(data);

  return (
    <div className="grid grid-flow-row grid-cols-5 gap-2">
      {mangaList.map((manga, index) => (
        <Card
          key={index}
          manga_name={manga.title}
          cover={manga.cover_link}
          current_chapter={"Chapter " + manga.latest_chapter}
          chapter_url={manga.latest_chapter_url}
        />
      ))}
    </div>
  );
}
