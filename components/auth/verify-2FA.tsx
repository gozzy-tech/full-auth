"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyCodeSchema } from "@/schemas";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react";
import { useResend2FA, useVerify2FA } from "@/api/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "../custom/loading-spinner";
import { saveToken } from "@/utils/auth";

type verifyCodeSchemaFormValues = z.infer<typeof verifyCodeSchema>;

export function Verify2FAForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [verifying, setVerifying] = useState(false);
  const [resendCode, setResendCode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null);
  const { storedValue: persistEmail, removeValue } = useLocalStorage<
    string | null
  >("persistEmail", null);

  // form validation
  const form = useForm<verifyCodeSchemaFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const { reset } = form;

  // -----------------------------------------------------
  // onSubmit function to handle form submission
  // -----------------------------------------------------
  const onSubmit = async (values: verifyCodeSchemaFormValues) => {
    setVerifying(true);
    const response = await useVerify2FA(values.code);
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Login successful!");
      reset();
      saveToken(response?.data);
      if (persistRedirect) {
        setValue(null);
        removeValue();
        if (pathname === persistRedirect) {
          window.location.reload();
        } else {
          router.push(persistRedirect);
        }
      } else {
        router.push("/dashboard");
      }
    } else {
      toast.error(response?.data?.message || "Invalid 2FA code!");
      reset();
    }
    setVerifying(false);
  };


  // -----------------------------------------------------
  // handleResendCode function to resend verification code
  // -----------------------------------------------------
  const handleResendCode = async () => {
    setResendCode(true);
    if (!persistEmail) {
      toast.error("Oops! Email not found!");
      return;
    }
    const response = await useResend2FA(persistEmail);
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Code resent successfully!");
      removeValue();
    } else {
      toast.error(response?.data?.message || "Failed to resend code!");
    }
    setResendCode(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter your 2FA Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your 2FA code"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={verifying}>
                {verifying ? (
                  <LoadingSpinner message="verifying..." />
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center text-sm">
                you didn't receive the code?{" "}
                {resendCode ? (
                  <LoadingSpinner message="resending..." />
                ) : (
                  <span
                    role="button"
                    className="text-primary cursor-pointer hover:underline"
                    onClick={handleResendCode}
                  >
                    Resend Code
                  </span>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
