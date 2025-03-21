// import { ok } from 'assert'

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./css/spinner.css"
import axios from "axios";

import { toast } from "sonner";
import { useAuthContext } from "../context/userContext";
import { baseURL } from "../utils/config";

console.log(baseURL, "baseUrl");

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { userAuthenticated } = useAuthContext();
  useEffect(() => {
    if (userAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(
        `${baseURL}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(response, "response data");
  
      if (response.status === 200) {
        const { accessToken, refreshToken,user } = response.data;
        localStorage.setItem("urlAccessToken", accessToken);
        localStorage.setItem("urlRefreshToken", refreshToken);
        localStorage.setItem("urlUserData", JSON.stringify(user));
        setUserAuthenticated(true);
        navigate("/home");
      }
    } catch (error: any) {
      
      if (error.response) {
        console.error("Login error:", error.response.data);
        toast.error(error.response.data.error || "Invalid credentials");
      } else {
        console.error("Network error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
    finally {
      setLoading(false)
    }
  };
  
  return (
    <>
      {loading && (
  <div className="fixed inset-0 flex items-center flex-col justify-center bg-gray-200 bg-opacity-50 backdrop-blur-sm z-50">
    <div className="spinner"></div>
    <h2>Loading ...</h2>
  </div>
)}


<div className="relative flex items-center justify-center bg-gray-200 text-slate-950 min-h-screen">
        <div className=" absolute flex items-center  bg-slate-900  rounded-lg justify-center mx-8 my-12 p-16 shadow-lg gap-6 h-fit flex-col">
          <h1 className="text-2xl text-white mt-4 font-semibold text-center">
            Welcome to URL Management
          </h1>

          <form
            className="flex w-fit h-fit justify-center space-y-6 flex-col items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 rounded-lg"
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4  rounded-lg"
            />
            <button
              type="submit"
              className="w-fit bg-blue-600 cursor-pointer text-gray-200 hover:bg-blue-900  hover:text-white rounded-md h-fit  px-4 py-2 items-center"
            >
              Login
            </button>
            <span className="text-white mt-4 mb-2">Don't have an Account?</span>
            <Link to={'/register'} className="text-white opacity-80 cursor-pointer hover:opacity-100  transition-all">Signup</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
