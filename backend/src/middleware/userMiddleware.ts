import { NextFunction, Request, Response } from "express";
import authconfig from "../config/authConfig";
import UserRepository from "../repositories/userRepository";

const userRepository=new UserRepository()
class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }}}
async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log(req.query,"ggs")
        console.log(req.headers,"jjj");
        
        const token = req.headers?.["authorization"]?.split(' ')[1];
        console.log("token in middleware",token);
        
        if (!token) {
            throw new HttpError("No access token found", 403);
        }

        const decodeToken:any = await authconfig.verifyAccessToken(token);
        console.log(decodeToken,"decodeTOken in middleware");
        
        if (!decodeToken) {
            console.log("gfdgdff");
            
            throw new HttpError("Token is not valid", 401);
        }

        
        req.user = {
            id: decodeToken.userId, 
            
        }  
        
        const isUserValid = await userRepository.findById (decodeToken.userId);
        if (!isUserValid ) {
            console.log("bddhdh");
            
            throw new HttpError("Not Authorized", 403);
        }
          // req.user=decodeToken
          console.log("sfss");
          
        next();
    } catch (error) {
        console.log("error in middleware",error);
        
        next(error);
    }
}

export default verifyToken
