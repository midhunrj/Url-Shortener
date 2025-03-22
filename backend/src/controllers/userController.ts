import { Request, Response } from "express";
import UserService from "../services/userService"

const userService=new UserService()
export class UserController{

    async register (req: Request, res: Response) {
        try {
            const {username,email,password}=req.body
            console.log(req.body,"dsfds");
            
          const user = await userService.register(username,email,password);
          console.log("return data",user);
          
          if(user)
          {
          res.status(201).json(user);
          }
        } catch (err) {
          res.status(400).json({ message: "Error in registering the userdata" });
        }
      };
    async login(req:Request,res:Response)
    {
     try {
        const {email,password}=req.body
        const userData=await userService.login(email,password)
        
        if (!userData) {
            res.status(404).json({ error: "Invalid credentials" });
            return
       }
       const{refreshToken}=userData as{refreshToken:string}
                res.cookie('urlRefreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV==="production",  // Only send secure cookies in production
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
        res.status(200).json(userData)
     } catch (error) {
        console.log(error,"error in creating product")
    res.status(500).json({message:"Error in fetching login user"})
    }
     
    }
    async refreshAccessToken(req: Request, res: Response) {
        try {
            console.log("Request cookies: ++++++++++++++++++++++++++++++++++", req.cookies);  
            const { urlRefreshToken } = req.cookies;
            console.log("Refresh token from cookies:", urlRefreshToken);  
    
            if (!urlRefreshToken) {
                console.log("No refresh token found");  
                res.status(401).json({ message: "Refresh token is missing" });
                return
            }
    
            const newAccessToken = await userService.refreshAccessToken(urlRefreshToken);
            console.log("New Access Token:", newAccessToken); 
            res.status(200).json({ message: "New access token created", accessToken: newAccessToken });
    
        } catch (error) {
            console.error("Error while refreshing access token:", error);  
            res.status(500).json({ message: "Failed to refresh access token" });
        }
    }
    
}