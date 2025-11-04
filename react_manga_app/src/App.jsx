  import { useState, useEffect } from 'react';
  import './App.css';
  import Card from './components/card.jsx';
  import Navbar from './components/navbar.jsx';
  import test from './test.jsx';
  import { APP_BASE_URL } from '/config.js';

  function App() {
    const [mangaData, setMangaData] = useState(null);

    useEffect(() => {
      fetch(APP_BASE_URL)
        .then((response) => response.json())
        .then((data) => setMangaData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className=" min-h-screen pt-15 px-10">
          <Navbar />
          <div className="grid grid-flow-row grid-cols-5 gap-2">
            <Card manga_name="One Piece" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 1000" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="My Bias gets on the last train home" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
            <Card manga_name="Naruto" manga_image="src/assets/OP_cover.jpg" current_chapter="Chapter 700" />
        </div>
      </div>
    );
  }

  export default App;
