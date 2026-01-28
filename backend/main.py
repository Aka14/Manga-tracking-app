import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
import requests
import webbrowser
from dotenv import load_dotenv
import os
from jose import jwt
import supabase
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from pydantic import BaseModel


load_dotenv()
app = FastAPI()
mangadex_key = os.getenv("MANGADEX_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url, supabase_key)
# profiles = supabase.table("profiles").select("*").execute()
# response = (
#     supabase.table("savedManga")
#     .select("*")
#     .execute()
# )
# print(response)

# supabase = create_client(supabase_url,supabase_key, options=ClientOptions(
#         auto_refresh_token=False,
#         persist_session=False,
#     )
# )

#admin_auth_client = supabase.auth.admin

#print(supabase.auth.admin.list_users())

# JWKS_URL = f"{supabase_url}/auth/v1/.well-known/jwks.json"
# jwks = requests.get(JWKS_URL).json()

# def get_user_id_from_token(token: str) -> str:
#     header = jwt.get_unverified_header(token)
#     key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])

#     payload = jwt.decode(
#         token,
#         key,
#         audience="authenticated",
#         algorithms=["RS256"]
#     )
#     print(payload["sub"])
#     return payload["sub"]




app.add_middleware(
    CORSMiddleware,
#     allow_origins= [
#     "http://localhost",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "https://www.mangapill.com",
#     "http://www.mangapill.com"
# ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)



base_url = "https://www.mangapill.com"
#manga that user is tracking & not reading currently
saved_manga = []
#manga that user is reading currently & dosen't want to keep track of new chapters
current_manga = []
#manga that user has read & wants to keep their place while they wait for chapters
re_reads = []


@app.post('/api/get-data')
async def get_token(token: Request):
    data = await token.json()
    token = data.get("token")
    try: 
        response = supabase.auth.get_user(token)
        user = response.user
        print(user.id)
        table = supabase.table("savedManga").select("*").eq("user_id", user.id).execute()
        print(table)
        for manga in table.data:
            save_manga(saved_manga, manga['name'], manga['current_chapter'])
        table = supabase.table("reReads").select("*").eq("user_id", user.id).execute()
        for manga in table.data:
            save_manga(re_reads, manga['name'], manga['current_chapter'])
    except Exception as e:
        print(f"Error: {e}")
        print("Invalid or expired token")
    return {"recieved": token}

def save_manga_to_db(userId, manga_data, db_name="savedManga"):
    manga_name = manga_data[0]
    current_chapter = manga_data[1]
    manga_url = get_manga_url(manga_name)
    manga_cover = get_manga_cover(manga_name)
    print("in save to db", userId, manga_name, current_chapter, base_url + find_chapter(manga_url, current_chapter), manga_cover)
    supabase.table(db_name).insert({
        "user_id": userId,
        "name": manga_name,
        "chapter_link": base_url + find_chapter(manga_url, current_chapter),
        "current_chapter": current_chapter,
        "cover_link": manga_cover
    }).execute()


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

def normalize_title(title):
    # Remove anything in parentheses
    title = re.sub(r"\s*\(.*?\)", "", title)
    # Collapse extra whitespace
    return title.strip()


def get_manga_cover(manga_name):
    base_mangadex_url = 'https://api.mangadex.org'
    id_params = {'title': normalize_title(manga_name), 'limit': 1}
    id_response = requests.get(base_mangadex_url + '/manga', params=id_params)
    id_data = id_response.json()
    if not id_data["data"]:
        return None
    else:
        id = id_data["data"][0]["id"]
        cover_params = {'manga[]': id, 'limit': 1}
        cover_response = requests.get(base_mangadex_url + '/cover', params=cover_params)
        cover_data = cover_response.json()
    if cover_data["data"]:
        file_name = cover_data["data"][0]["attributes"]["fileName"]
        cover_url ='https://uploads.mangadex.org/covers/' + id + '/' + file_name + '.256.jpg'
        return cover_url
    return None

def duplicate_check(collection, manga_name):
    for manga in collection:
        if manga_name == manga['title']:
            return True
    return False

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

# Returns chapter of a manga
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

#Returns a better search of the latest chapter in a manga
def find_better_chapter(manga_url, chapter_number=None):
    chapters = find_chapters(manga_url)
    if chapter_number != None:
        i = 0
        for chapter in chapters:
            i = i+1
            number = chapter.split("/")[-1].split("-")[-1]
            # print(number)
            if float(number) == float(chapter_number):
                return chapters[i-1]
    else:
        return chapters[-1]

# print("better chapter", find_better_chapter(get_manga_url("Record of Ragnarok"), 3))

def save_manga(manga_list, manga_name, current_chapter=1):
    manga_url = get_manga_url(manga_name)
    manga_cover = get_manga_cover(manga_name)
    manga = {
        "title": manga_name,
        "url": manga_url,
        "current_chapter": current_chapter,
        "chapter_url": find_chapter(manga_url, current_chapter),
        "latest_chapter": None,
        "latest_chapter_url":None,
        "cover_link": manga_cover
    }
    if duplicate_check(manga_list, manga_name) == False:
        manga_list.append(manga)
    return manga


def open_manga(manga):
    webbrowser.open(base_url + find_chapter(manga['url'], manga['current_chapter']))

#save_manga(saved_manga, 'One Piece', 1100)
#save_manga(saved_manga, 'Record of Ragnarok', 110)
#save_manga(re_reads, 'Greatest Estate Developer')
#print(find_chapter(get_manga_url('One Piece')))

def get_manga_from_js(chapter_link):
    page = requests.get(chapter_link)
    soup = BeautifulSoup(page.text, features="html.parser")
    result = soup.find(id="top").get_text()
    # text = result.get_text()
    print(result)
    name = result.split(" Chapter ")
    print(name[0])
    return [name[0], float(name[1])]

class ChapterData(BaseModel):
    chapter_link: str
    userId: str


@app.post('/api/get-current-link')
async def get_link(data: ChapterData):
    link = data.chapter_link
    userId = data.userId
    print(userId)
    manga_data = get_manga_from_js(link)
    print(manga_data)
    save_manga(saved_manga, manga_data[0], manga_data[1])
    save_manga_to_db(userId, manga_data)
    print(saved_manga)
    return {"recieved": link}

@app.post('/api/get-re-read-link')
async def get_link(data: ChapterData):
    link = data.chapter_link
    userId = data.userId
    print(userId)
    manga_data = get_manga_from_js(link)
    print(manga_data)
    save_manga_to_db(userId, manga_data, "reReads")
    return {"recieved": link}



@app.get("/api/get-saved-manga")
def get_saved_manga():
    print(saved_manga)
    return {"saved_manga": saved_manga}

@app.get("/api/get-re-reads")
def get_re_reads():
    return {"re_reads": re_reads}

@app.get("/api/get-new-chapters")
def get_new_chapters():
    new_chapters = []
    for manga in saved_manga:
        latest_chapter = find_chapter(manga['url']).split("/")[-1].split("-")[-1]
        if float(latest_chapter) > float(manga['current_chapter']):
            manga['latest_chapter'] = latest_chapter
            manga['latest_chapter_url'] = find_chapter(manga['url'])
            new_chapters.append(manga)
    return {"new_chapters": new_chapters}

@app.get("/")
def read_root():
    return {"Hello": "Manga App!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

