import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { BookCreateSchema, BookUpdateSchema } from '~/features/book/book.schema';
import { UtilConstant } from '~/shared/constants/utils';
import { joiValiadation } from '~/shared/decorators/joi-validation.decorator';
import { bookService } from '~/shared/services/book.service';

class BookController {
  @joiValiadation(BookCreateSchema)
  public async createBook(req: Request, res: Response, next: NextFunction) {
    const book = await bookService.add(req.body, req.currentUser);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Book created successfully',
      data: book
    });
  }

  public async getMyBooks(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || UtilConstant.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || UtilConstant.DEFAULT_PAGE_LIMIT;
    const filter = req.query.status ? { status: req.query.status } : {};

    const books = await bookService.getAll(page, limit, req.currentUser, filter);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get my books',
      data: books.data,
      total: books.total,
      page: books.page,
      limit: books.limit,
      totalPages: books.totalPages
    });
  }

  public async getBook(req: Request, res: Response, next: NextFunction) {
    const book = await bookService.getOne(req.params.bookId, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'get book',
      data: book
    });
  }

  @joiValiadation(BookUpdateSchema)
  public async updateBook(req: Request, res: Response, next: NextFunction) {
    const book = await bookService.update(req.params.bookId, req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Updated book',
      data: book
    });
  }

  public async deleteBook(req: Request, res: Response, next: NextFunction) {
    await bookService.remove(req.params.bookId, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete book'
    });
  }
}

export const bookController: BookController = new BookController();
