import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/userRepository";
import { IUser } from "../Types/user";
import authconfig from "../config/authConfig";
const userRepository = new UserRepository();

export default class UserService {
  async register(username: string, email: string, password: string):Promise<IUser|null> {
    console.log("dss");
    
    const hashedPassword = await authconfig.hashPassword(password);
    return await userRepository.createUser({ username, email, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await userRepository.login(email);
    console.log(user,"kjsnkjnk");
    
    if (!user)
    {
        return null
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    let payload={userId:user._id}
    const accessToken=await authconfig.generateAccessToken(payload)
    const refreshToken=await authconfig.generateRefreshToken(payload)
    console.log(accessToken,refreshToken,"sss")
    
    return {accessToken,refreshToken, user };
  }

  async refreshAccessToken(refreshToken: string):Promise<string> {
    try {
        const decoded = await authconfig.verifyRefreshToken(refreshToken);
        if (!decoded) throw new Error("Invalid refresh token");

        const accessToken = await authconfig.generateAccessToken({ userId: decoded.userId,  });
        console.log("Generated new access token:", accessToken);  // Check new token generation
        return accessToken;
    } catch (error) {
        console.error("Error during token refresh:", error);  // Log the error
        throw new Error("Failed to refresh access token");
    }
    
}
}
