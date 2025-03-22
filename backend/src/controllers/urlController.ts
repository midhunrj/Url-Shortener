import { Request, Response } from "express"
import UrlService from "../services/urlService"

const urlService=new UrlService()
export class UrlController{
    async createShortUrl(req:Request,res:Response)
    {
        try {
            const {longUrl}=req.body
            const userId=req.user?.id as string
            const urlData= await urlService.shortenUrl(userId,longUrl)
            res.status(201).json(urlData)
        } catch (error) {
            console.log(error,"failed to create a short url")
            
        }
    }
    async getShortUrl(req:Request,res:Response)
    {
        try {
            const{shortUrl}=req.params
           const urlRecord=await urlService.getOriginalUrl(shortUrl)
           if (!urlRecord) {
             res.status(404).json({ message: "Short URL not found" });
             return
          }
           res.redirect(urlRecord.longUrl)
        } catch (error) {
            console.log(error,"failed to get the original url")
            
        }
    }
    async getALLUrlByUser(req:Request,res:Response)
    {
        try {
            const userId=req.user?.id
            const{page,limit}=req.query
            console.log("hhbbjfjs",req.params);
            
           const totalUrlData=await urlService.getUrlByUser(userId!,parseInt(page as string),parseInt(limit as string))
           console.log(totalUrlData,"toatla sfs");
           const {urlData,totalPages}=totalUrlData
           res.status(200).json({urlData,totalPages,currentPage:Number(page)})
        } catch (error) {
            console.log(error,"failed to get the original url")
            
        }
    }


}