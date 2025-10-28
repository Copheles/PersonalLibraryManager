"use client";

import CreateBookForm from "@/components/books/book-create";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const router = useRouter();

  return (
    <Box sx={{ py: 2, width: '100%' }}>
      {/* Header */}
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/books")}
          sx={{
            mb: 3,
            color: "text.secondary",
          }}
        >
          Back to Books
        </Button>
      </Box>

      {/* Form */}
      <CreateBookForm />
    </Box>
  );
}
