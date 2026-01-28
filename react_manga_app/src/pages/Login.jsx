import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useLocation } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { API_URL } from "../config/index.js";


const supabase = createClient(
  "https://rwljtpxwkrwlhblvrfkv.supabase.co",
  "sb_publishable_DUtOZlMRIusJ-Wknan_Q6w_Z3uOnDVv"
);

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userData, setUserData] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkData() {
      const { data, error } = await supabase.auth.getSession();
      setUserData(data);
    }
    checkData();
  }, []);

  async function handleLogin() {
    console.log(email)
    console.log(password)
     const {data, error} = await supabase.auth.signInWithPassword({
        email: email, 
        password: password
    })

    if(error){
        alert("Error logging in:")
    }
    else{
        setUserData(data);
        const {data: {session}, error} = await supabase.auth.getSession();
        try {
          const response = await fetch(`${API_URL}get-data`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: session.access_token}),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseData = await response.json();
          console.log('token sent:', responseData);
          console.log(session.access_token);
        } catch (error) {
          console.error('Error:', error);
  }
        navigate("/saved-manga");
    }
  }
  async function handleLogout() {
     const {data, error} = await supabase.auth.signOut();
     setUserData(null);
  }

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-200 lg:py-0">
        {/* <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        ></a> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#2c2c2c] dark:[#dfd0b8]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-[#dfd0b8]">
              Sign in to your account
            </h1>
            <div className="space-y-4 md:space-y-6" action="#">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dfd0b8] dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  onChange={(e) => setEmail(e.target.value)}
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
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-[gray-50] focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    ></input>
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="remember"
                      className="text-gray-500 dark:text-[#dfd0b8]"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="reset-password"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full text-[#dfd0b8] bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[primary-600] dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="sign-up"
                  className="font-medium text-primary-600 hover:underline dark:text-[#dfd0b8]"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
