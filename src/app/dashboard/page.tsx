"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  // 未ログインの場合はトップページへリダイレクト
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return <DashboardView user={user} onLogout={handleLogout} />;
}
