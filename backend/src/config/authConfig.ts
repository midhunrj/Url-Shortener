import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config(); 
const authconfig={
    accessTokenSecret:process.env.ACCESS_TOKEN_SECRET as string  ,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string, 
    accessTokenExpiry: '7m' as string,
    refreshTokenExpiry: '7d' as string,
    
    
    async hashPassword(password:string):Promise<string>
    {
        return await bcrypt.hash(password,10)
    },
    async compare(password:string,hashedPassword:string):Promise<boolean>
    {
        return bcrypt.compare(password,hashedPassword)
    },

    generateAccessToken(payload:object):string{
        console.log(payload,"payload for generating AccessToken");

        
        return jwt.sign(payload,this.accessTokenSecret!,{expiresIn:'1m'})
    },

    generateRefreshToken(payload:object):string{
        console.log(payload,"payload for generating refreshToken");
      
        return jwt.sign(payload,this.refreshTokenSecret!,{expiresIn:'7d'})

    },

    verifyAccessToken(token:string):JwtPayload|null{
      try{  console.log("kjhbhb");
        
      const decoded=jwt.verify(token,this.accessTokenSecret!)
      console.log(decoded,"jhhgfhgf");
      
      return typeof decoded ==="string"?null:decoded
      }
      catch (error) {
        return null;
      }
    },

    verifyRefreshToken(token:string):JwtPayload|null{
        try{
     const decoded=jwt.verify(token,this.refreshTokenSecret!)
     return typeof decoded==="string"?null:decoded
    }
    catch (error) {
        return null;
      }
    },

    server_url:process.env.SERVER_URL
    
}

export default authconfig