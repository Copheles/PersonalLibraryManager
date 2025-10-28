"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Bookmark, CheckCircle, Star } from "@mui/icons-material";
import { CreateBookFormData, createBookSchema } from "@/schema/book.schema";
import { IBook } from "@/libs/types/book.type";

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IBook) => void;
  initialData?: IBook | null;
  isEdit?: boolean;
  loading?: boolean;
}

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

export default function BookForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  loading = false,
}: BookFormProps) {
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

  const watchedRating = watch("rating");
  const watchedStatus = watch("status");

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("author", initialData.author);
      setValue("rating", initialData.rating);
      setValue("review", initialData.review);
      setValue("status", initialData.status);
    } else {
      reset({
        title: "",
        author: "",
        rating: 3,
        review: "",
        status: "reading",
      });
    }
  }, [initialData, open, reset, setValue]);

  const handleFormSubmit = (data: CreateBookFormData) => {
    const submitData: CreateBookFormData = {
      ...data,
    };
    onSubmit(submitData);
  };

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((opt) => opt.value === status)?.color || "default"
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="600">
          {isEdit ? "Edit Book" : "Add New Book"}
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Title and Author Row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Book Title"
                variant="outlined"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Author"
                variant="outlined"
                {...register("author")}
                error={!!errors.author}
                helperText={errors.author?.message}
                disabled={loading}
              />
            </Box>

            {/* Status and Rating Row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth error={!!errors.status} disabled={loading}>
                <InputLabel>Reading Status</InputLabel>
                <Select
                  value={watchedStatus}
                  label="Reading Status"
                  onChange={(e) => setValue("status", e.target.value as any)}
                  renderValue={(selected) => (
                    <Chip
                      label={
                        statusOptions.find((opt) => opt.value === selected)
                          ?.label
                      }
                      color={getStatusColor(selected)}
                      variant="filled"
                      size="small"
                    />
                  )}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ width: "100%" }}>
                <Typography
                  component="legend"
                  gutterBottom
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >
                  Your Rating
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Rating
                    value={watchedRating}
                    onChange={(_, newValue) => {
                      setValue("rating", newValue || 3);
                    }}
                    size="large"
                    disabled={loading}
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#ff6d75",
                      },
                    }}
                  />
                  <Chip
                    label={`${watchedRating}/5`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                </Box>
                {errors.rating && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.rating.message}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Review */}
            <TextField
              multiline
              rows={4}
              label="Your Review"
              variant="outlined"
              {...register("review")}
              error={!!errors.review}
              helperText={`${watch("review")?.length || 0}/1000 characters - ${
                errors.review?.message || "Share your thoughts about this book"
              }`}
              disabled={loading}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
