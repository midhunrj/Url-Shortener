// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { userAuthenticate } from "../utils/userInterceptor";
// import { useAuthContext } from "../context/userContext";
// import NavMenu from "./navMenu";
// import { baseURL } from "../utils/config";
//  import {BiCopy} from 'react-icons/bi'
// export interface Iurl {
//   _id: string;
//   shortUrl: string;
//   longUrl: string;
//   userId: string;
//   createdAt: Date;
// }

// const History = () => {
//   const [urls, setUrls] = useState<Iurl[]>([]);
//   const { user,userAuthenticated } = useAuthContext();  

//   useEffect(() => {
//     if (!userAuthenticated) return;
//         console.log("hellow");
        
//     const fetchUrls = async () => {
//       try {
//         console.log("user before calling",user);
        
//         const response = await userAuthenticate.get(`/listUrls/${user?._id}`);
//         setUrls(response.data);
//       } catch (err) {
//         console.error("Error fetching URLs:", err);
//         toast.error("Failed to load history.");
//       }
//     };

//     fetchUrls();
//   }, [user]);

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied to clipboard!");
//   };

//   return (
//     <>
//     <NavMenu/>
//     <div className="min-h-screen bg-gray-200 p-6">
//       <h1 className="text-3xl font-semibold text-center text-gray-900">URL History</h1>
      
//       <div className="max-w-2xl mx-auto mt-6">
//         {urls.length === 0 ? (
//           <p className="text-center text-gray-600">No URLs created yet.</p>
//         ) : (
//           urls.map((url) => (
//             <div key={url._id} className="bg-white w-fit m-auto  shadow-md p-4 rounded-lg mb-4">
//               {/* <p className="text-gray-700 "><span className="text-base font-bold">Original</span>&nbsp; : {url.longUrl}</p> */}
//               <div className="flex justify-between  gap-12">
//               <p className="text-gray-700"><span className="text-base font-bold">
//                 Short URL</span>: 
//                 <a href={`${baseURL}/${url.shortUrl}`} target="_blank" className="text-blue-500 underline ml-2">
//                   {`${baseURL}/${url.shortUrl}`}
//                 </a>
//               </p>
//               <button
//                 onClick={() => copyToClipboard(`${baseURL}/${url.shortUrl}`)}
//                 className=" bg-gray-700 text-white p-2 rounded-md"
//               >
//                 <BiCopy size={20}/>
//               </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//     </>
//   );
// };

// export default History;

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { userAuthenticate } from "../utils/userInterceptor";
import { useAuthContext } from "../context/userContext";
import NavMenu from "./navMenu";
import { baseURL } from "../utils/config";
import { BiCopy } from "react-icons/bi";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

export interface Iurl {
  _id: string;
  shortUrl: string;
  longUrl: string;
  userId: string;
  createdAt: string;
}

const History = () => {
  const [urls, setUrls] = useState<Iurl[]>([]);
  const { user, userAuthenticated } = useAuthContext();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null); // To track expanded URL

  useEffect(() => {
    if (!userAuthenticated) return;

    const fetchUrls = async () => {
      try {
        const response = await userAuthenticate.get(
          `/listUrls/${user?._id}?page=${page}&limit=5`
        );
        setUrls(response.data.urlData);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching URLs:", err);
        toast.error("Failed to load history.");
      }
    };

    fetchUrls();
  }, [user, page]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <NavMenu />
      <div className="min-h-screen bg-gray-200 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900">
          URL History
        </h1>

        <div className="max-w-2xl mx-auto mt-6">
          {urls.length === 0 ? (
            <p className="text-center text-gray-600">No URLs created yet.</p>
          ) : (
            urls.map((url) => (
              <div
                key={url._id}
                className="bg-white shadow-md p-4 rounded-lg mb-4"
              >
            
                <p className="text-gray-500 text-sm">
                  Created: {new Date(url.createdAt).toLocaleString()}
                </p>

                
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    <span className="text-base font-bold">Short URL</span>:
                    <a
                      href={`${baseURL}/${url.shortUrl}`}
                      target="_blank"
                      className="text-blue-500 underline ml-2"
                    >
                      {`${baseURL}/${url.shortUrl}`}
                    </a>
                  </p>
                  <button
                    onClick={() => copyToClipboard(`${baseURL}/${url.shortUrl}`)}
                    className="bg-gray-700 text-white p-2 rounded-md"
                  >
                    <BiCopy size={20} />
                  </button>
                </div>

                
                <button
                  onClick={() =>
                    setExpandedUrl(expandedUrl === url._id ? null : url._id)
                  }
                  className="text-sm text-blue-600 mt-2"
                >
                  {expandedUrl === url._id ? "Hide" : "Show"} Original URL
                </button>
                {expandedUrl === url._id && (
                  <p className="text-gray-800 mt-2 break-all">
                    <span className="font-bold">Original URL:</span> {url.longUrl}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

    
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-white ${
                page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
              }`}
            >
              <AiOutlineArrowLeft size={20} />
            </button>

            <span className="text-lg font-semibold">{`Page ${page} of ${totalPages}`}</span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md text-white ${
                page === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
              }`}
            >
              <AiOutlineArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
