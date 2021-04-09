import { Document } from 'mongoose';

export interface IUser extends Document {
  status: string;
  readonly email: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly gender: string;
  readonly searchField: string;
  readonly phone: string;
  readonly roles: string[];
  readonly password: string;
}
