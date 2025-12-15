import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";

const App = () => {
  return (
    <div>
      <Navbar />
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getData = async (mode, endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      });
      const data = await response.json();
      navigate(`/${mode}`, { state: { data } });
      return data;
    } catch (err) {
      console.log("Fetch error", err);
    }
  };

  return (
    <nav className="bg-[#2c2c2c] dark:bg-white rounded-4xl fixed w-xl z-20 h-10 top-0 left-1/2 -translate-x-1/2 mt-5">
      <div className="max-w-7xl flex flex-wrap items-center justify-center mx-auto p-2">
        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-white dark:border-gray-700">
          <li>
            <button
              onClick={() => {
                navigate("new-chapters");
              }}
              className={`block py-2 px-2 text-black p-2 w-[130px] md:p-0 rounded-full ${
                location.pathname === "/new-chapters"
                  ? "bg-gray-300"
                  : "hover:bg-gray-300"
              }`}
            >
              New Chapters
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                getData("saved-manga", "get-saved-manga");
              }}
              className={`block py-2 px-2 text-black p-2 w-[130px] md:p-0 rounded-full ${
                location.pathname === "/saved-manga"
                  ? "bg-gray-300"
                  : "hover:bg-gray-300"
              }`}
            >
              Saved Manga
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                getData("re-reads", "get-re-reads");
              }}
              className={`block py-2 px-2 text-black p-2 w-[130px] md:p-0 rounded-full ${
                location.pathname === "/re-reads"
                  ? "bg-gray-300"
                  : "hover:bg-gray-300"
              }`}
            >
              Re-reads
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default App;
