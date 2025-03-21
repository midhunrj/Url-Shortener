import React from 'react'
import { useAuthContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
    const {setUserAuthenticated}=useAuthContext()
    const navigate=useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("urlUserData");
        setUserAuthenticated(false);
        navigate("/");
      };
  return (
<div className="w-full h-20 bg-slate-900 flex  items-center justify-around px-6">
        <span className="text-white hover:opacity-60 cursor-pointer" onClick={()=>navigate('/home')}>Home</span>
        <span className="text-white hover:opacity-60 cursor-pointer" onClick={()=>navigate('/history')}>Urls</span>
        <span
          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </span>
      </div>

  )
}

export default NavMenu