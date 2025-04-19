"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
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
import { loginSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../custom/loading-spinner";
import { toast } from "sonner";
import { useLogin } from "@/api/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/utils/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { API_URL } from "@/api/constant";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const pathname = usePathname();
  const { storedValue, setValue } = useLocalStorage<string | null>(
    "persistRedirect",
    null
  );
  const { setValue: setPersistEmail } = useLocalStorage<string | null>(
    "persistEmail",
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  // persist the Redirect URL in local storage
  useEffect(() => {
    if (redirect) {
      setValue(redirect);
    }
  }, [redirect]);

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login Data:", data);
    setSubmitting(true);
    const response = await useLogin(data);

    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Login successful!");
      reset();

      if (response?.data?.two_factor_required) {

        // -------------------------------------------------------
        // if 2FA is required, redirect to 2FA verification page
        // -------------------------------------------------------
        setPersistEmail(data.email);
        router.push("/verify-2FA");
      } else if (response?.data?.verification_needed) {

        // -------------------------------------------------------
        // if email verification is needed, redirect to email verification page
        // -------------------------------------------------------
        toast.success(
          "Email verification required. Please check your inbox, for the verification code"
        );
        setPersistEmail(data.email);
        router.push("/verify-email");
      } else {
        
        // -------------------------------------------------------
        // if login is successful, save the token and redirect to the dashboard or the original page
        // -------------------------------------------------------
        saveToken(response?.data);
        if (redirect) {
          const redirectUrl = storedValue || redirect;
          setValue(null);
          if (pathname === redirectUrl) {
            window.location.reload();
          } else {
            router.push(redirectUrl);
          }
        } else {
          router.push("/dashboard");
        }
      }
    } else {
      toast.error(response?.message || "Login failed.");
    }
    setSubmitting(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Button
                variant="outline"
                className="w-full flex gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`${API_URL}/auth/login/google`, "_self");
                }}
              >
                <FcGoogle />
                Login with Google
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <LoadingSpinner message="signing in..." />
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
