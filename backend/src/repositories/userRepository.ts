import { User } from "../models/userModel";
import { IUser } from "../Types/user";

export default class UserRepository {
  async login(email: string):Promise<IUser|null> {
    return await User.findOne({ email });
  }
  
  async findById(userId: string):Promise<IUser|null> {
    return await User.findById({_id:userId})
  }
  async createUser(user:IUser):Promise<IUser|null> {
    return await User.create(user);
  }
}
