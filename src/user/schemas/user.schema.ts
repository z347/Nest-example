import * as mongoose from 'mongoose';

import { GenderEnum } from '../enums/gender.enum';
import { RoleEnum } from '../enums/role.enum';
import { StatusEnum } from '../enums/status.enum';

export const UserSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.pending,
  },
  role: {
    required: true,
    type: [String],
    enum: Object.values(RoleEnum),
    default: RoleEnum.user,
  },
  email: {
    required: true,
    type: String,
    lowercase: true,
  },
  firstName: {
    required: true,
    type: String,
    lowercase: true,
  },
  lastName: {
    required: true,
    type: String,
    lowercase: true,
  },
  gender: {
    required: true,
    type: String,
    enum: Object.values(GenderEnum),
  },
  phone: {
    type: String,
    default: null,
  },
  password: {
    required: true,
    type: String,
  },
});

UserSchema.index({ email: true }, { unique: true });
