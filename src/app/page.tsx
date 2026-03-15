"use client";

import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing/HeroSection";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    // ダミーログイン: Firebase 接続後にここを差し替える
    login({
      uid: "dummy-uid-001",
      displayName: "テストユーザー",
      email: null,
    });
    router.push("/dashboard");
  };

  return <HeroSection onLogin={handleLogin} />;
}
