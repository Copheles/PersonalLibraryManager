
import rateLimit from 'express-rate-limit';


export const createBookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: 'Too many books added from this IP, please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false
});


export const updateBookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many book updates from this IP, please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false
});
