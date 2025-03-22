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

// const corsOptions:CorsOptions={
//     origin:[process.env.CLIENT_URL!,"http://localhost:5173"],
//     credentials:true,
//     allowedHeaders: ["Content-Type", "Authorization"],
// }
const corsOptions = {
    origin: [process.env.CLIENT_URL!, "http://localhost:5173", "https://url-shortener-rho-amber.vercel.app"], // Add frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure all required methods are allowed
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
};
app.use(cors(corsOptions)) 
app.options("*",cors(corsOptions))

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