

import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { userAuthenticate } from "../utils/userInterceptor";
import NavMenu from "./navMenu";
import { BiCopy } from "react-icons/bi";

const Home = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrls, setShortUrls] = useState<string[]>([]);
  const { setUserAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("urlUserData");
    setUserAuthenticated(false);
    navigate("/");
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Short URL copied to clipboard!");
  };
  const isValidUrl = (url: string) => {
    try {
      new URL(url); 
      return true;
    } catch (_) {
      return false;
    }
  };
  const GenerateLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!longUrl.trim() || !isValidUrl(longUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      const token = localStorage.getItem("urlAccessToken");
      if (!token) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await userAuthenticate.post(
        "/create-link",
        { longUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShortUrls([...shortUrls, response.data.shortUrl]); 
      setLongUrl(""); 
      toast.success("Short URL created successfully!");
    } catch (err) {
      console.error("Error in creating URL:", err);
      toast.error("An error occurred while creating the short URL");
    }
  };

  return (
    <>
      <NavMenu/>

      <div className="flex min-h-screen justify-center flex-col bg-slate-200 p-4">
        <h1 className="text-3xl font-medium text-center text-slate-950">
          Shorten URL Generator
        </h1>
        <p className="text-gray-800 text-center mt-2">
          Welcome! Enter a URL below to create a short and shareable link.
        </p>

        <form
          onSubmit={GenerateLink}
          className="text-center w-full max-w-lg mx-auto mt-6 space-y-4"
        >
          <input
            type="text"
            value={longUrl}
            placeholder="Enter long URL"
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full px-4 py-2 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          />
          <button
            type="submit"
            disabled={!longUrl.trim()}
            className={`px-4 py-2 rounded-md text-xl text-white ${
              longUrl.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create a new Link
          </button>
        </form>

        
        <div className="mt-6 space-y-4 w-full max-w-lg mx-auto">
          {shortUrls.map((url, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline truncate max-w-[70%]"
              >
                {url}
              </a>
              <button
                onClick={() => copyToClipboard(url)}
                className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600"
              >
                <BiCopy size={20}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home
