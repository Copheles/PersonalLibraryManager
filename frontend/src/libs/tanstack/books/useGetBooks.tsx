import { useQuery } from "@tanstack/react-query";
import bookApi from "@/libs/apis/book.api";
import { BookQueryParams } from "@/libs/types/book.type";

export default function useGetBooks(params?: BookQueryParams) {
  return useQuery({
    queryKey: [bookApi.KEY, params],
    queryFn: () => bookApi.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
    gcTime:  1000 * 60 * 5, // Keep cache for 5 minutes
  });
}
