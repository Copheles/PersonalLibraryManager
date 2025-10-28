import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from '~/features/user/user.model';

export enum BookStatus {
  READING = 'reading',
  COMPLETED = 'completed',
  WISHLIST = 'wishList'
}

export interface BookDocument extends Document {
  title: string;
  author: string;
  status: BookStatus;
  rating?: number; 
  review?: string;
  ownerId: mongoose.Types.ObjectId | UserDocument;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<BookDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(BookStatus),
      default: BookStatus.WISHLIST,
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    review: {
      type: String,
      trim: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const BookModel = mongoose.model<BookDocument>('Book', bookSchema);

export default BookModel;
