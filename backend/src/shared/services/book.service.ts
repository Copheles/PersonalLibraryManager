import mongoose from 'mongoose';
import BookModel, { BookDocument } from '~/features/book/book.model';
import { IBook, IBookUpdate } from '~/features/book/book.interface';
import { bookCache } from '~/shared/cache/bookCache';
import { REDIS_KEY } from '~/shared/constants/redisKeys';
import { NotFoundError, ForbiddenError } from '~/shared/helpers/error-handler';
import { Helper, PaginateResult } from '~/shared/helpers/helper';

class BookService {
  private readonly CACHE_TTL = 3600; // 1 hour

  public async add(requestBody: IBook, currentUser: UserPayload) {
    const book = await BookModel.create({
      ...requestBody,
      ownerId: currentUser._id
    });

    await this.invalidateUserBooksCache(currentUser._id);
    return book;
  }

  public async getAll(page?: number, limit?: number, currentUser?: UserPayload, filter: any = {}) {
    if (!currentUser) throw new ForbiddenError('User is required');

    // Ensure ownerId cannot be overridden
    const defaultFilter = { ...filter, ownerId: new mongoose.Types.ObjectId(currentUser._id) };

    const options = { page, limit, filter: defaultFilter, sort: { updatedAt: -1 } };
    const cacheKey = Helper.generateCacheKey(REDIS_KEY.BOOKS, options);

    // Cache first
    const cached = await bookCache.get<PaginateResult<BookDocument>>(cacheKey);
    if (cached) {
      console.log('it is cached');
      return cached;
    }

    // Fetch from DB
    const result = await Helper.paginate<BookDocument>(BookModel, options);

    // Cache result
    await bookCache.set(cacheKey, result, this.CACHE_TTL);
    console.log('it is not cached');

    return result;
  }

  public async getOne(bookId: string, currentUser: UserPayload) {
    const cacheKey = `${REDIS_KEY.BOOKS}:${bookId}`;

    // Cache first
    const cached = await bookCache.get<BookDocument>(cacheKey);
    if (cached) {
      Helper.checkPermit(cached, 'ownerId', currentUser);
      return cached;
    }

    // Fetch from DB
    const book = await BookModel.findById(bookId).lean();
    if (!book) throw new NotFoundError(`Not found book with ID:${bookId}`);

    Helper.checkPermit(book, 'ownerId', currentUser);

    // Cache result
    await bookCache.set(cacheKey, book, this.CACHE_TTL);

    return book;
  }

  public async update(bookId: string, requestBody: IBookUpdate, currentUser: UserPayload) {
    const book = await BookModel.findById(bookId);
    if (!book) throw new NotFoundError(`Not found book with ID:${bookId}`);

    Helper.checkPermit(book, 'ownerId', currentUser);

    const updateData: Partial<IBookUpdate> = {};
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined) updateData[key as keyof IBookUpdate] = value;
    });

    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateData, { new: true, lean: true });

    await this.invalidateBookCaches(bookId, currentUser._id);

    return updatedBook;
  }

  public async remove(bookId: string, currentUser: UserPayload) {
    const book = await BookModel.findById(bookId);
    if (!book) throw new NotFoundError(`Not found book with ID:${bookId}`);

    Helper.checkPermit(book, 'ownerId', currentUser);

    await BookModel.findByIdAndDelete(bookId);
    await this.invalidateBookCaches(bookId, currentUser._id);
  }

  // Cache invalidation
  private async invalidateBookCaches(bookId: string, userId: string) {
    await Promise.all([bookCache.del(`${REDIS_KEY.BOOKS}:${bookId}`), this.invalidateUserBooksCache(userId)]);
  }

  private async invalidateUserBooksCache(userId: string) {
    const pattern = `${REDIS_KEY.BOOKS}:user:${userId}:*`;
    await bookCache.deleteByPattern(pattern);
  }
}

export const bookService = new BookService();
