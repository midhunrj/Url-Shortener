import { v4 as uuidv4 } from "uuid";
import UrlRepository from "../repositories/urlRepository";
import authconfig from "../config/authConfig";

const urlRepository = new UrlRepository();

export default class UrlService {
  async shortenUrl( userId: string,longUrl:string) {
    const shortUrl = uuidv4().slice(0, 6);
    const savedUrl=await urlRepository.createUrl({ longUrl, shortUrl, userId });
     return {shortUrl:`${authconfig.server_url}/${savedUrl.shortUrl}`}
  }

  async getOriginalUrl(shortUrl: string) {
    return await urlRepository.findUrlByShort(shortUrl);
  }
  async getUrlByUser(userId: string,page:number,limit:number) {
    console.log(userId,"userId,",page,"lim",limit);
    
    return await urlRepository.findUrlsByUser(userId,page,limit);
  }
}
