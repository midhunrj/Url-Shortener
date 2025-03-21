import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:{type:Date,default:Date.now}
});

export const Url = mongoose.model('Url', UrlSchema);
