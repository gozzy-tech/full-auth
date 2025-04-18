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
import { verify2FASchema } from "@/schemas";

type verify2FAFormValues = z.infer<typeof verify2FASchema>;

export function Verify2FAForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<verify2FAFormValues>({
    resolver: zodResolver(verify2FASchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: verify2FAFormValues) => {
    console.log("2FA Code:", values.code);
    // 🔗 call your 2FA verification API here
  };

  const handleResendCode = () => {
    console.log("Resend Code Clicked");
    // 🔗 call your API to resend the code her
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

              <Button type="submit" className="w-full">
                Verify Code
              </Button>

              <div className="text-center text-sm">
                you didn't receive the code?{" "}
                <Button
                  variant={"link"}
                  className="inline-flex items-center"
                  onClick={handleResendCode}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
