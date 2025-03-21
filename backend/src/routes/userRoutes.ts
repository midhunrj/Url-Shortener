import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UrlController } from "../controllers/urlController";
import verifyToken from "../middleware/userMiddleware";

const userController=new UserController()
const urlController=new UrlController()
const userRouter=Router()

userRouter.post('/signup',userController.register)
userRouter.post('/login',userController.login)
userRouter.post('/create-link',verifyToken, urlController.createShortUrl)
userRouter.get('/:shortUrl', urlController.getShortUrl)
userRouter.get('/listUrls/:userId',verifyToken, urlController.getALLUrlByUser)
userRouter.get('/auth/refreshtoken',userController.refreshAccessToken)

export default userRouter