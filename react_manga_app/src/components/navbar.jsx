import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#2c2c2c] dark:bg-white rounded-4xl fixed w-xl z-20 h-10 top-0 left-1/2 -translate-x-1/2 mt-5">
      <div className="max-w-7xl flex flex-wrap items-center justify-center mx-auto p-2">
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        </div>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-white dark:border-gray-700">
            <li>
              <button
                onClick={() => window.location.href = "/new-chapters"}
                class="block py-2 px-2 text-black p-2 w-[130px] hover:rounded-full hover:bg-gray-300 md:p-0 "
                aria-current="page"
              >
                New Chapters
              </button>
            </li>
            <li>
              <button
                onClick={() => window.location.href = "/saved-manga"}
                class="block py-2 px-2 text-black p-2 w-[130px] hover:rounded-full hover:bg-gray-300 md:p-0 "
              >
                Saved Manga
              </button>
            </li>
            <li>
              <button
                onClick={() => window.location.href = "/re-reads"}
                class="block py-2 px-2 text-black p-2 w-[130px] hover:rounded-full hover:bg-gray-300 md:p-0 "
              >
                Re-reads
              </button>
            </li>
          </ul> 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
