import { Url } from "../models/urlModel";

export default class UrlRepository {
  async createUrl(urlData: any) {
    return await Url.create(urlData);
  }

  async findUrlByShort(shortUrl: string) {
    return await Url.findOne({ shortUrl });
  }
  async findUrlsByUser(userId:string,page:number,limit:number)
  {
    const skip=Number(page-1)*Number(limit)
    const urlData=await Url.find({userId}).sort({createdAt:-1}).limit(limit).skip(skip)
    const urlDataCount=await Url.countDocuments({userId})
    return {urlData,totalPages:Math.ceil(urlDataCount/Number(limit))}
  }
}
