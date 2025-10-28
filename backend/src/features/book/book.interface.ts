import { Types } from 'mongoose';
import { BookStatus } from '~/features/book/book.model';
import { UserDocument } from '~/features/user/user.model';

export interface IBook {
  title: string;
  author: string;
  status: BookStatus;
  rating?: number;  
  review?: string;   
  ownerId: Types.ObjectId | UserDocument;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookUpdate {
  title?: string;
  author?: string;
  status?: BookStatus;
  rating?: number;
  review?: string;
}
