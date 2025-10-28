"use client";

import { useAppSelector } from "@/libs/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnAuthorizedPage() {
  const isAuthenticated = useAppSelector((state) => state.user.data);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/books");
  }, [isAuthenticated, router]);

  return null;
}
