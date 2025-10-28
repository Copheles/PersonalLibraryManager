"use client";

import { IBook } from "@/libs/types/book.type";
import {
  Add,
  Delete,
  Edit,
  Star,
  Visibility,
  FilterList,
  Clear,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookListProps {
  books: IBook[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (book: IBook) => void;
  onDelete: (book: IBook) => void;
  onStatusFilter: (status: string) => void;
  loading?: boolean;
}

const statusConfig = {
  reading: { label: "Reading", color: "primary" as const },
  completed: { label: "Completed", color: "success" as const },
  wishList: { label: "Wishlist", color: "secondary" as const },
} as const;

const getStatusConfig = (status: string) => {
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.reading
  );
};

export default function BookList({
  books,
  total,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onStatusFilter,
  loading = false,
}: BookListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusFilterChange = (event: any) => {
    const status = event.target.value;
    setStatusFilter(status);
    onStatusFilter(status);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/books/${id}`);
  };

  const handleCreateBook = () => {
    router.push("/books/create");
  };

  const clearFilters = () => {
    setStatusFilter("");
    onStatusFilter("");
  };

  // Mobile Card View
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="600"
              gutterBottom
            >
              My Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total} {total === 1 ? "book" : "books"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateBook}
            sx={{ borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>

        {/* Filters */}
        <Card
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "background.paper",
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterList fontSize="small" color="action" />
              <Typography variant="subtitle2" fontWeight={500}>
                Filter by Status
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Books</MenuItem>
                <MenuItem value="reading">Currently Reading</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="wishList">Wishlist</MenuItem>
              </Select>
            </FormControl>

            {statusFilter && (
              <Button
                onClick={clearFilters}
                startIcon={<Clear />}
                size="small"
                sx={{ alignSelf: "flex-start" }}
              >
                Clear Filter
              </Button>
            )}
          </Stack>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Books List */}
        {!loading && (
          <Stack spacing={2}>
            {books.map((book) => (
              <Card
                key={book._id}
                sx={{
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        by {book.author}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusConfig(book.status).label}
                      color={getStatusConfig(book.status).color}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Star sx={{ color: "#ffb400", fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {book.rating}/5
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {book.review}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 3,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(book._id as string)}
                      sx={{
                        backgroundColor: "action.hover",
                        "&:hover": { backgroundColor: "action.selected" },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(book)}
                      sx={{
                        backgroundColor: "action.hover",
                        "&:hover": { backgroundColor: "action.selected" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(book)}
                      sx={{
                        backgroundColor: "error.light",
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.main",
                          color: "white",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* No Results */}
        {!loading && books.length === 0 && (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {statusFilter ? "No books match your filter" : "No books yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {statusFilter
                ? "Try changing your filter criteria"
                : "Start building your library by adding your first book"}
            </Typography>
            {!statusFilter && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateBook}
                sx={{ borderRadius: 2 }}
              >
                Add First Book
              </Button>
            )}
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => onPageChange(value)}
              color="primary"
              size="small"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Desktop Table View
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
            My Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {total} {total === 1 ? "book" : "books"} in your collection
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateBook}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Book
        </Button>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          background: "background.paper",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 120,
            }}
          >
            <FilterList fontSize="small" color="action" />
            <Typography variant="subtitle2" fontWeight={500}>
              Status
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Books</MenuItem>
              <MenuItem value="reading">Currently Reading</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="wishList">Wishlist</MenuItem>
            </Select>
          </FormControl>

          {statusFilter && (
            <Button onClick={clearFilters} startIcon={<Clear />} size="small">
              Clear
            </Button>
          )}
        </Stack>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Books Table */}
      {!loading && books.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600, py: 3 }}>
                  Book Title
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 3 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 3 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 3 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 3 }}>Review</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, py: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow
                  key={book._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "grey.50" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography fontWeight="600" fontSize="0.95rem">
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography color="text.secondary">
                      {book.author}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Star sx={{ color: "#ffb400", fontSize: 20 }} />
                      <Typography fontWeight={500}>{book.rating}/5</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={getStatusConfig(book.status).label}
                      color={getStatusConfig(book.status).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        maxWidth: 300,
                        lineHeight: 1.5,
                        color: "text.secondary",
                      }}
                    >
                      {book.review}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(book._id as string)}
                        sx={{
                          backgroundColor: "action.hover",
                          "&:hover": { backgroundColor: "action.selected" },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(book)}
                        sx={{
                          backgroundColor: "action.hover",
                          "&:hover": { backgroundColor: "action.selected" },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(book)}
                        sx={{
                          backgroundColor: "error.light",
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.main",
                            color: "white",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results */}
      {!loading && books.length === 0 && (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            background: "background.paper",
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {statusFilter ? "No matching books" : "Your library is empty"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {statusFilter
              ? "Try adjusting your filters to see more results"
              : "Start your reading journey by adding your first book"}
          </Typography>
          {!statusFilter && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateBook}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Add Your First Book
            </Button>
          )}
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            p: 2,
            borderRadius: 2,
            background: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Page {page} of {totalPages} • {total} total books
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
