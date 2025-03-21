import { Types } from "mongoose";

export interface IUrl{
    _id:string
    shortUrl:string
    longUrl:string,
    userId:Types.ObjectId,
}