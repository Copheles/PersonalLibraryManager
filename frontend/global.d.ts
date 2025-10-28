interface IUser {
  _id: string;
  email: string;
}

interface IAuthResponse {
  message: string;
}

interface IErrorResponse {
  message: string;
  status: string;
  statusCode: number;
}

interface ICurrentUser {
  _id: string;
  email: string;
  lat: number;
  exp: number;
}

export interface IBackendResponse<T> {
  message: string;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
