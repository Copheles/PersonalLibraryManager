import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, 
  message: 'Too many login attempts from this IP, please try again after a minute.',
  standardHeaders: true, 
  legacyHeaders: false
});


export const registerLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 2, 
  message: 'Too many account creation attempts from this IP, please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false
});
