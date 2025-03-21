import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors,{CorsOptions} from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes'
dotenv.config()


const app=express()

app.use(express.json())

app.use(cookieParser())

const corsOptions:CorsOptions={
    origin:[process.env.CLIENT_URL!],
    credentials:true,
}
app.use(cors(corsOptions)) 

mongoose.connect(process.env.MONGODB_URL!)
.then(()=>{
    console.log("mongdb connected");
    
})
.catch((err)=>{
    console.log(err,"error mongo");
    
})

console.log("AccessTokenSecret:", process.env.ACCESS_TOKEN_SECRET);
console.log("RefreshTokenSecret:", process.env.REFRESH_TOKEN_SECRET);

app.use('/',userRouter)
app.listen(7986,()=>{
    console.log(`server is connected and running on port 7986`);
    
})