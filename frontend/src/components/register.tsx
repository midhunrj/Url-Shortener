// import { ok } from 'assert'

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./css/spinner.css"
import axios from "axios";

import { toast } from "sonner";
import { useAuthContext } from "../context/userContext";
import { baseURL } from "../utils/config";


const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors,setErrors]=useState<{[key:string]:string}>({})
  // const [otp, setOtp] = useState("");
  // const [otpSent, setOtpSent] = useState(false);
  // const [timer, setTimer] = useState(60);
  // const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { userAuthenticated } = useAuthContext();
  console.log(baseURL, "baseUrl");
  useEffect(() => {
    if (userAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, []);
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (otpSent && timer > 0) {
  //     interval = setInterval(() => {
  //       setTimer((prev) => prev - 1);
  //     }, 1000);
  //   } else if (timer === 0) {
  //     setCanResend(true);
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [otpSent, timer]);

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};

    if (!username.trim()) tempErrors.username = "Username is required";
    if (!email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email format";

    if (!password.trim()) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    //if (otpSent && !otp.trim()) tempErrors.otp = "OTP is required";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) {
      setTimeout(() => setErrors({}), 3000); 
    }
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true)
    try {
        console.log("nksnkn",baseURL)
      const response = await axios.post(
        `${baseURL}/signup`,
        { username,email, password },
        { withCredentials: true }
      );
      console.log(response, "response data");
  
      if (response.status === 201) {
        // const { accessToken, refreshToken } = response.data;
        // localStorage.setItem("URlShortenerAccessToken", accessToken);
        // localStorage.setItem("URlShortenerRefreshToken", refreshToken);
        // localStorage.setItem("URlShortenerData", JSON.stringify(true));
        //setUserAuthenticated(true);
        navigate("/");
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
              value={username}
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 rounded-lg"
            />
             {errors.username && <span className="text-red-500">{errors.username}</span>}

            <input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 rounded-lg"
            />
             {errors.email && <span className="text-red-500">{errors.email}</span>}

            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4  rounded-lg"
            />
             {errors.password && <span className="text-red-500">{errors.password}</span>}

            <button
              type="submit"
              className="w-fit bg-blue-600 cursor-pointer text-gray-200 hover:bg-blue-900  hover:text-white rounded-md h-fit  px-4 py-2 items-center"
            >
              Register
            </button>
            <span className="text-white mt-4 mb-2">Already have an Account?</span>
            <Link to={'/'} className="text-white opacity-80 cursor-pointer hover:opacity-100  transition-all">Login</Link>
          
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
