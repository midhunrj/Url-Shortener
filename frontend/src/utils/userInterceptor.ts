import axios from "axios";


import { toast } from "sonner";
import { baseURL } from "./config";



export const userAuthenticate = axios.create({
    baseURL: baseURL, 
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});


userAuthenticate.interceptors.request.use(
    (request) => {
        const userAccessToken = localStorage.getItem('urlAccessToken');
        if (userAccessToken) {
            request.headers.Authorization = `Bearer ${userAccessToken}`;
        }
        return request;
    },  
    (error) => {
        return Promise.reject(error);
    }
);
// const handleUnauthorizedAccess = async(message:string) => {
//     localStorage.removeItem("accessToken");
    
    
//      window.location.href = "/"; // Use window.location.href to navigate
//     toast.error(message);
// };

const handleUnauthorizedAccess = (message: string) => {
    localStorage.removeItem("urlAccessToken");
     

    toast.error(message, {
        description: "Your session has expired. Please login again.",
        duration: 4000,  
        position: "top-right", 
    });

    
    setTimeout(() => {
        window.location.replace("/"); 
    }, 2000);
    
};
userAuthenticate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error,"error of response in interceptor");
        
        const originalRequest = error.config; 
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await userAuthenticate.get('/auth/refreshtoken');
                console.log(response,"sksksnkj");
                
                const newuserAccessToken = response.data.accessToken;
                localStorage.setItem('urlAccessToken', newuserAccessToken);

                userAuthenticate.defaults.headers.common["Authorization"] = `Bearer ${newuserAccessToken}`;

                return userAuthenticate(originalRequest);
            } catch (error) {
                console.log("Token refresh failed", error);

            }
        }
        else if(error.response.status === 403)
        {
         console.log('balle balle')
            localStorage.removeItem('urlAccessToken')
            
            handleUnauthorizedAccess('User has been blocked temporarily')
          
        }
        return Promise.reject(error);
    }
);
