export type CreateBookInputs = {
  title: string;
  author: string;
  rating: number;
  review: string;
  status: "reading" | "completed" | "wishList";
};

export type UpdateBookInputs = CreateBookInputs;

export type IBook = {
  title: string;
  author: string;
  status: "reading" | "completed" | "wishList";
  rating: number;
  review: string;
  ownerId?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type BookQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};
