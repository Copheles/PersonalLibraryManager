"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import authApi from "@/libs/apis/auth.api";
import { useRouter } from "next/navigation";
import { Link } from "@mui/material";
import { RegisterInputs } from "@/libs/types/auth.type";
import * as yup from "yup";

// Validation schema
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await authApi.register(data);
      router.push("/");
    } catch (error: any) {
      console.error(error);
    }
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
            Create Account
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign up to get started
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
                placeholder="Create a password"
                type="password"
                autoComplete="new-password"
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
              Create Account
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link
              href="/login"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Card>
      </Container>
    </>
  );
}
