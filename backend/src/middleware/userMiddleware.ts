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

// import { NextFunction, Request, Response } from "express";
// import authconfig from "../config/authConfig";
// import UserRepository from "../repositories/userRepository";

// const userRepository = new UserRepository();

// class HttpError extends Error {
//     status: number;
//     constructor(message: string, status: number) {
//         super(message);
//         this.status = status;
//     }
// }

// // Extend Express Request type to include `user`
// declare global {
//     namespace Express {
//         interface Request {
//             user?: {
//                 id: string;
//             };
//         }
//     }
// }

// async function verifyToken(req: Request, res: Response, next: NextFunction) {
//     try {
//         console.log("Headers:", req.headers);

//         const authHeader = req.headers["authorization"];
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             throw new HttpError("No access token found", 403);
//         }

//         const token = authHeader.split(" ")[1];
//         console.log("Token in middleware:", token);

//         const decodeToken = await authconfig.verifyAccessToken(token);
//         console.log("Decoded token in middleware:", decodeToken);

//         if (!decodeToken || !decodeToken.userId) {
//             throw new HttpError("Token is not valid", 401);
//         }

//         // Attach user info to the request object
//         req.user = { id: decodeToken.userId };

//         // Check if the user exists in the database
//         console.log(req.user,"req user");
        
//         const isUserValid = await userRepository.findById(decodeToken.userId);
//         if (!isUserValid) {
//             throw new HttpError("Not Authorized", 403);
//         }

//         console.log("User authenticated successfully.");
//         next();
//     } catch (error) {
//         console.error("Error in middleware:", error);
//         next(error instanceof HttpError ? error : new HttpError("Unauthorized", 401));
//     }
// }

// export default verifyToken;
