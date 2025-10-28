import { Document, Model } from 'mongoose';
import { REDIS_KEY } from '~/shared/constants/redisKeys';
import { UtilConstant } from '~/shared/constants/utils';
import { ForbiddenError } from '~/shared/helpers/error-handler';

export interface PaginateResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class Helper {
  // Ownership Check
  public static checkPermit<T extends { [key: string]: any }>(
    model: T,
    modelProperty: string,
    currentUser: UserPayload
  ) {
    if (currentUser._id === model![modelProperty].toString()) return;

    throw new ForbiddenError('You cannot perform this action');
  }

  // Generate cache keys
  public static generateCacheKey<T>(prefix: string, options: PaginateOptions<T>): string {
    const { page = 1, limit = 10, filter = {}, sort = {} } = options;

    const normalizedFilter = JSON.stringify(filter, Object.keys(filter).sort());
    const normalizedSort = JSON.stringify(sort, Object.keys(sort).sort());

    // Extract user ID for better cache management
    const userId = filter.ownerId ? `:user:${filter.ownerId.toString()}` : '';

    return `${prefix}${userId}:${page}:${limit}:${normalizedFilter}:${normalizedSort}`;
  }

  // Pagination
  public static async paginate<T extends Document>(
    model: Model<T>,
    options: PaginateOptions<T>
  ): Promise<PaginateResult<T>> {
    const page = options.page && options.page > 0 ? options.page : UtilConstant.DEFAULT_PAGE;
    const limit = options.limit && options.limit > 0 ? options.limit : UtilConstant.DEFAULT_PAGE_LIMIT;

    const skip = (page - 1) * limit;

    const filter = options.filter || {};
    const sort = options.sort || { updatedAt: -1 };

    const [total, data] = await Promise.all([
      model.countDocuments(filter),
      model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(options.select || '')
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      total,
      page,
      limit,
      totalPages
    };
  }
}
