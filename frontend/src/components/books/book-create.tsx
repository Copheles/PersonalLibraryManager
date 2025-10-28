"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { Add, Bookmark, CheckCircle, Star } from "@mui/icons-material";
import useCreateBook from "@/libs/tanstack/books/useCreateBook";
import { CreateBookFormData, createBookSchema } from "@/schema/book.schema";
import { useRouter } from "next/navigation";

const statusOptions = [
  {
    value: "reading" as const,
    label: "Currently Reading",
    icon: <Bookmark sx={{ fontSize: 18 }} />,
    color: "primary" as const,
  },
  {
    value: "completed" as const,
    label: "Completed",
    icon: <CheckCircle sx={{ fontSize: 18 }} />,
    color: "success" as const,
  },
  {
    value: "wishList" as const,
    label: "Wishlist",
    icon: <Star sx={{ fontSize: 18 }} />,
    color: "secondary" as const,
  },
];

interface CreateBookFormProps {
  onCancel?: () => void;
}

export default function CreateBookForm({ onCancel }: CreateBookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
      rating: 3,
      review: "",
      status: "reading",
    },
  });

  const router = useRouter();
  const createBookMutation = useCreateBook();
  const watchedRating = watch("rating");
  const watchedStatus = watch("status");

  const onSubmit = async (data: CreateBookFormData) => {
    createBookMutation.mutate(data, {
      onSuccess() {
        reset();
        router.push('/');
      }
    });
  };

  return (
    <Box sx={{ pb: 4, width: '100%'}}>
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Add sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Add New Book
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the details to add a book to your collection
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Title and Author */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Book Title"
                placeholder="Enter book title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <TextField
                fullWidth
                label="Author"
                placeholder="Enter author name"
                {...register("author")}
                error={!!errors.author}
                helperText={errors.author?.message}
              />
            </Stack>

            {/* Status and Rating */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Reading Status</InputLabel>
                <Select
                  value={watchedStatus}
                  label="Reading Status"
                  onChange={(e) => setValue("status", e.target.value as any)}
                  renderValue={(selected) => (
                    <Chip
                      label={statusOptions.find((opt) => opt.value === selected)?.label}
                      color={statusOptions.find((opt) => opt.value === selected)?.color || "default"}
                      size="small"
                    />
                  )}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ width: "100%" }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Your Rating
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Rating
                    value={watchedRating}
                    onChange={(_, newValue) => {
                      setValue("rating", newValue || 3);
                    }}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffb400',
                      },
                    }}
                  />
                  <Chip
                    label={`${watchedRating}/5`}
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                {errors.rating && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errors.rating.message}
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* Review */}
            <TextField
              multiline
              rows={4}
              label="Your Review"
              placeholder="Share your thoughts about this book..."
              {...register("review")}
              error={!!errors.review}
              helperText={`${watch("review")?.length || 0}/1000 characters • ${
                errors.review?.message || "What did you think of this book?"
              }`}
            />

            {/* Error Alert */}
            {createBookMutation.isError && (
              <Alert severity="error">
                Failed to create book. Please try again.
              </Alert>
            )}

            {/* Action Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={createBookMutation.isPending}
                startIcon={
                  createBookMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Add />
                  )
                }
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {createBookMutation.isPending ? "Adding Book..." : "Add to Library"}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={onCancel}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Box>

          {/* Status Guide */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Reading Status Guide
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {statusOptions.map((option) => (
                <Chip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  size="small"
                  variant={watchedStatus === option.value ? "filled" : "outlined"}
                  color={option.color}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}