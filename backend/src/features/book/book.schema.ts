import Joi from 'joi';
import { BookStatus } from '~/features/book/book.model';

export const BookCreateSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title must be of type string',
    'string.empty': 'Title is a required field'
  }),

  author: Joi.string().required().messages({
    'string.base': 'Author must be of type string',
    'string.empty': 'Author is a required field'
  }),

  status: Joi.string()
    .valid(...Object.values(BookStatus))
    .default(BookStatus.WISHLIST)
    .messages({
      'any.only': `Status must be one of ${Object.values(BookStatus).join(', ')}`
    }),

  rating: Joi.number().min(0).max(5).messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 0',
    'number.max': 'Rating cannot exceed 5'
  }),

  review: Joi.string().allow('').messages({
    'string.base': 'Review must be of type string'
  })
});

export const BookUpdateSchema = BookCreateSchema.min(1);
