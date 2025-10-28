declare namespace Express {
  export interface Request {
    currentUser: UserPayload;
  }
}

interface PaginateOptions<T> {
  page?: number;
  limit?: number;
  filter?: any;
  sort?: any;
  select?: string;
  cacheKey?: string;
  ttl?: number;
}

interface UserPayload {
  _id: string;
  email: string;
}
