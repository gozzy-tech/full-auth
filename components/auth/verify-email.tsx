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
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useResendVerificationEmail, useVerifyEmailToken } from "@/api/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { verifyCodeSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveToken } from "@/utils/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../custom/loading-spinner";

type verifyCodeSchemaFormValues = z.infer<typeof verifyCodeSchema>;

export function EmailVerification({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [resendCode, setResendCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null); // persistRedirect is the path to redirect after verification
  const { storedValue: persistEmail, removeValue } = useLocalStorage<
    string | null
  >("persistEmail", null); // persistEmail is the email address used to resend the code
  const pathname = usePathname();
  const router = useRouter();

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
    const response = await useVerifyEmailToken(values.code);
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Email verified successfully!");
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
      toast.error(response?.data?.message || "Invalid verification code!");
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
    const response = await useResendVerificationEmail(persistEmail);
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
          <CardTitle className="text-xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
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
