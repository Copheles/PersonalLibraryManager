import axiosClient from "@/libs/apis";
import {
  BookQueryParams,
  CreateBookInputs,
  IBook,
  UpdateBookInputs,
} from "@/libs/types/book.type";
import { IBackendResponse } from "../../../global";

const bookApi = {
  KEY: "books",
  create(data: CreateBookInputs) {
    return axiosClient.post<unknown, IBackendResponse<IBook>>("/books", data);
  },

  getAll(params?: BookQueryParams) {
    return axiosClient.get<unknown, IBackendResponse<IBook[]>>("/books", {
      params,
    });
  },

  getOne(id: string) {
    return axiosClient.get<unknown, IBackendResponse<IBook>>(`/books/${id}`);
  },

  update({ id, data }: { id: string; data: UpdateBookInputs }) {
    return axiosClient.put(`/books/${id}`, data);
  },

  delete(id: string) {
    return axiosClient.delete(`/books/${id}`);
  },
};

export default bookApi;
