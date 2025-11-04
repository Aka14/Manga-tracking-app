from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
import requests
import webbrowser


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orgins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

base_url = "https://www.mangapill.com"
#manga that user is tracking & not reading currently
saved_manga = []
#manga that user is reading currently & dosen't want to keep track of new chapters
current_manga = []
#manga that user has read & wants to keep their place while they wait for chapters
re_reads = []


#url = "https://www.mangapill.com/manga/4035/shuumatsu-no-walk-re"   
#page = requests.get(url)
#soup = BeautifulSoup(page.text, features="html.parser")

#gets a manga url from the name
def get_manga_url(manga_name):
    search_url = base_url + "/search?q=" + manga_name.replace(" ", "+") + "&type=&status="
    page = requests.get(search_url)
    soup = BeautifulSoup(page.text, features="html.parser")
    results = []
    for manga in soup.find_all("a", href=True):
        if "/manga/" in manga['href']:
            results.append(manga['href'])
    return results[0] if results else None



for manga in saved_manga:
    if manga.current_chapter <= manga.latest_chapter:
        print(f"New chapter available for {manga.title}: Chapter {manga.latest_chapter}")

#Finds chapters of a manga
def find_chapters(manga_url):
    page = requests.get(base_url + manga_url)
    soup = BeautifulSoup(page.text, features="html.parser")
    chapters = soup.find(id="chapters")
    chapter_list = []
    for chapter in chapters.find_all("a", href=True):
        chapter_list.append(chapter['href'])
    chapter_list.reverse()
    return chapter_list

# Finds the latest chapter of a manga
def find_chapter(manga_url, chapter_number=None):
    chapters = find_chapters(manga_url)
    if chapter_number != None:
        i = 0
        for chapter in chapters:
            i = i+1
            number = chapter.split("/")[-1].split("-")[-1]
            if float(number) == float(chapter_number):
                return chapters[i-1]
    else:
        return chapters[-1]

def save_manga(manga_name, current_chapter=1):
    manga_url = get_manga_url(manga_name)
    manga = {
        "title": manga_name,
        "url": manga_url,
        "current_chapter": current_chapter,
    }
    saved_manga.append(manga)
    return manga


def open_manga(manga):
    webbrowser.open(base_url + find_chapter(manga['url'], manga['current_chapter']))

save_manga("one piece", 1150)
save_manga('my bias gets on the last train', 10)
save_manga('SSS class suicide hunter', 101)
save_manga("Greatest estate developer")

#webbrowser.open(base_url + find_latest_chapter("/manga/4035/shuumatsu-no-walk-re"))
#print(get_manga_url("Record of Ragnarok"))
#open_manga(saved_manga[3])

# @app.post("/recieve-data")
def get_manga_from_js(chapter_link):
    page = requests.get(chapter_link)
    soup = BeautifulSoup(page.text, features="html.parser")
    result = soup.find(id="top").get_text()
    # text = result.get_text()
    name = result.split("Chapter")
    return save_manga(name[0], float(name[1]))

print(get_manga_from_js("https://www.mangapill.com/chapters/8-10855000/kingdom-chapter-855"))
print(saved_manga)
#open_manga(saved_manga[2])
#open_manga(saved_manga[-1])
#print(find_chapter(get_manga_url("SSS class suicide hunter"), 100))

@app.get("/saved-manga")
def get_saved_manga():
    return {"saved_manga": saved_manga}

@app.get("/")
def read_root():
    return {"Hello": "Manga App!"}

@app.get("/data")
def read_data():
    return {"data": "This is some data from the server."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
