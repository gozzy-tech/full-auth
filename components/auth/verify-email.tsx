"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "../custom/form-error";
import { FormSuccess } from "../custom/form-success";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { useVerifyEmailToken } from "@/api/auth";
import Link from "next/link";

export function EmailVerification({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(async () => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Token does not exist");
      return;
    }
    setLoading(true);
    try {
      const response = await useVerifyEmailToken(token);
      if (response?.status === 200) {
        setSuccess(response?.data?.message || "Email verified successfully!");
      } else {
        setError(response?.message || "Email verification failed.");
      }
    } catch (error) {
      setError("Something went wrong with the verification.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  if (loading) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent>
            <div className="flex items-center justify-center w-full h-32">
              <div className="space-y-2 text-center">
                <CgSpinner className="animate-spin" />
                <p>verifying...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full gap-3">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button asChild>
              <Link href="/login" className="w-full">
                Proceed to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
