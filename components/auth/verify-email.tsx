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

export function EmailVerification({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Token does not exist");
      return;
    }
    setLoading(true);
    // 🔗 Call your API to verify the email here
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
          <div className="flex items-center justify-center w-full">
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
