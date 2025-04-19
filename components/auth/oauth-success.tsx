"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetOauthtoken } from "@/api/auth";
import { saveToken } from "@/utils/auth";
import useLocalStorage from "@/hooks/useLocalStorage";

const OauthSuccess = () => {
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null);
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    if (!code) {
      return;
    }

    const createOauthUserToken = async () => {
      const response = await useGetOauthtoken(code);
      if (response.status === 200) {
        toast.success(response?.data?.message || "Login successful!");
        saveToken(response?.data);
        if (persistRedirect) {
          setValue(null);
          if (pathname === persistRedirect) {
            window.location.reload();
          } else {
            router.push(persistRedirect);
          }
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error("Login failed. Please try again.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    createOauthUserToken();
  }, [code, router]);

  return null;
};

export default OauthSuccess;
