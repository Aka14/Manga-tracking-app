import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useLocation } from "react-router-dom";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabase = createClient(
  "https://rwljtpxwkrwlhblvrfkv.supabase.co",
  "sb_publishable_DUtOZlMRIusJ-Wknan_Q6w_Z3uOnDVv"
);

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userData, setUserData] = React.useState("");

  async function handleSignUp() {
    console.log(email)
    console.log(password)
    const {data, error} = await supabase.auth.signUp({
        email: email, 
        password: password
    })

    if(error){
        alert("Error signing up:")
    }
    else{
        setUserData(data);
        console.log(data);
    }
}

  useEffect(() => {
    async function checkData() {
      const { data, error } = await supabase.auth.getSession();
      setUserData(data);
      console.log(data)
    }
    checkData();
  }, []);

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-6 mx-auto md:h-200 lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#2c2c2c] dark:[#dfd0b8]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-[#dfd0b8]">
              Register your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-[#dfd0b8]"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dfd0b8] dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-[#dfd0b8]"
                >
                  Username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dfd0b8] dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  required=""
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
              </div>
              <div>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-[#dfd0b8]"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dfd0b8] dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div className="flex items-center justify-between">
              </div>
              <button
                type="button"
                className="w-full text-[#dfd0b8] bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-[primary-600] dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleSignUp}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
