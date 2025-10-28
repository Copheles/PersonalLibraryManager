import { Router } from 'express';
import { bookController } from '~/features/book/book.controller';
import { createBookLimiter, updateBookLimiter } from '~/features/book/book.rateLimit';

class BookRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/books', createBookLimiter, bookController.createBook);
    this.router.get('/books', bookController.getMyBooks);
    this.router.put('/books/:bookId', updateBookLimiter, bookController.updateBook);
    this.router.get('/books/:bookId', bookController.getBook);
    this.router.delete('/books/:bookId', bookController.deleteBook);
    return this.router;
  }
}

export const bookRoutes: BookRoutes = new BookRoutes();
