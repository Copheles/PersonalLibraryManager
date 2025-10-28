"use client";

import { useAppSelector } from "@/libs/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const isAuthenticated = useAppSelector((state) => state.user.data);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  return null;
}
