"use client";

import useLogin from "@/libs/tanstack/auth/useLogin";
import { LoginInputs } from "@/libs/types/auth.type";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
  });

  const mutation = useLogin();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            p: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Sign In
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Welcome back to your account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Email</FormLabel>
              <TextField
                fullWidth
                placeholder="Enter your email"
                autoComplete="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Password</FormLabel>
              <TextField
                fullWidth
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{
                py: 1.5,
                mt: 2,
                fontSize: "1rem",
              }}
            >
              Sign In
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 3 }}>
            Don't have an account?{" "}
            <Link
              href="/register"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Card>
      </Container>
    </>
  );
}
