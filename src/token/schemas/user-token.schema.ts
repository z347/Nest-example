import * as mongoose from 'mongoose';

export const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

TokenSchema.index({ token: 1, userId: 1 }, { unique: true });
