"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Container,
  Divider,
  Rating,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Book,
  Person,
  Star,
  Bookmark,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import useGetBook from "@/libs/tanstack/books/useGetBook";
import { CircularProgress, Alert } from "@mui/material";

const statusConfig = {
  reading: { label: "Currently Reading", color: "primary", icon: <Bookmark /> },
  completed: { label: "Completed", color: "success", icon: <CheckCircle /> },
  wishList: { label: "Wishlist", color: "secondary", icon: <Star /> },
};

// Helper function to safely format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Not available";

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const { data, isLoading, error } = useGetBook(bookId);

  const book = data?.data;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Book not found or failed to load.
        </Alert>
        <Button onClick={() => router.push("/books")} startIcon={<ArrowBack />}>
          Back to Books
        </Button>
      </Container>
    );
  }

  const statusInfo =
    statusConfig[book.status as keyof typeof statusConfig] ||
    statusConfig.reading;

  return (
    <Box sx={{ py: 2, width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/books")}
          sx={{ mb: 3 }}
        >
          Back to Library
        </Button>
      </Box>

      {/* Book Details Card */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                mx: "auto",
                mb: 2,
              }}
            >
              <Book sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Book Details
            </Typography>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              color={statusInfo.color as any}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Book Information */}
          <Stack spacing={4}>
            {/* Title & Author */}
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {book.title}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Person color="action" />
                <Typography variant="h6" color="text.secondary">
                  by {book.author}
                </Typography>
              </Box>
            </Box>

            {/* Rating & Status */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  YOUR RATING
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Rating
                    value={book.rating}
                    readOnly
                    size="large"
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#ffb400",
                      },
                    }}
                  />
                  <Chip
                    label={`${book.rating}/5`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  READING STATUS
                </Typography>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  color={statusInfo.color as any}
                  variant="filled"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Stack>

            {/* Review Section */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                YOUR REVIEW
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "grey.50",
                  minHeight: 120,
                }}
              >
                <Typography
                  sx={{
                    lineHeight: 1.6,
                    color: "text.primary",
                  }}
                >
                  {book.review || "No review provided."}
                </Typography>
              </Paper>
            </Box>

            {/* Additional Info */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  ADDED ON
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule color="action" />
                  <Typography>{formatDate(book.createdAt)}</Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  LAST UPDATED
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule color="action" />
                  <Typography>{formatDate(book.updatedAt)}</Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
