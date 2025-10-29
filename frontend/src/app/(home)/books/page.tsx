"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { IBook } from "@/libs/types/book.type";
import useGetBooks from "@/libs/tanstack/books/useGetBooks";
import useDeleteBook from "@/libs/tanstack/books/useDeleteBook";
import { CreateBookFormData } from "@/schema/book.schema";
import BookList from "@/components/books/books-list";
import BookForm from "@/components/books/book-form";
import DeleteConfirmationDialog from "@/components/books/book-delete-dialog";
import useUpdateBook from "@/libs/tanstack/books/useUpdateBook";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<IBook | null>(null);

  const limit = 3;

  const { data, isLoading } = useGetBooks({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const deleteBookMutation = useDeleteBook();
  const updateBookMutation = useUpdateBook();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleEdit = (book: IBook) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (book: IBook) => {
    setDeletingBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingBook) {
      deleteBookMutation.mutate(deletingBook._id as string, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingBook(null);
          setPage(1)
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingBook(null);
  };

  const handleFormSubmit = (formData: CreateBookFormData) => {
    console.log("check update data: ", formData);
    if (editingBook) {
      // Update existing book
      updateBookMutation.mutate(
        { id: editingBook._id as string, data: formData },
        {
          onSuccess: () => {
            setPage(1);
            setIsFormOpen(false);
            setEditingBook(null);
          },
        }
      );
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  return (
    <Box maxWidth="xl" sx={{ py: 4 }}>
      <BookList
        books={data?.data || []}
        total={data?.total || 0}
        page={page}
        limit={limit}
        totalPages={data?.totalPages || 0}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onStatusFilter={handleStatusFilter}
        loading={isLoading}
      />

      {/* Edit Book Form */}
      <BookForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
        isEdit={!!editingBook}
        loading={false}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        itemName={deletingBook?.title || ""}
        loading={deleteBookMutation.isPending}
      />
    </Box>
  );
}
