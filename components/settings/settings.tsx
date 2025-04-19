"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../custom/loading-spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordWithOldPasswordSchema,
  resetPasswordWithOldPasswordType,
  UserType,
} from "@/schemas";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Switch } from "../ui/switch";
import { useGetUserProfile } from "@/api/user";
import { DialogModal } from "../custom/dialog-modal";
import {
  useDisable2FA,
  useEnable2FA,
  useResendVerificationEmail,
  useResetPasswordWithOldPassword,
} from "@/api/auth";
import { toast } from "sonner";
import { removeToken } from "@/utils/auth";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

const Settings = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [open2FAModal, setOpen2FAModal] = useState(false);
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const { setValue: persistRedirect } = useLocalStorage<string | null>(
    "persistRedirect",
    null
  );
  const pathname = usePathname();
  const router = useRouter();
  const { data: userProfile, refetch } = useGetUserProfile() as {
    data: UserType;
    refetch: () => void;
  };

  const form = useForm<resetPasswordWithOldPasswordType>({
    resolver: zodResolver(resetPasswordWithOldPasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  // ------------------------------------------------
  // Handle password reset
  // -------------------------------------------------
  const handlePasswordReset = async (
    values: resetPasswordWithOldPasswordType
  ) => {
    setUpdatingPassword(true);
    const response = await useResetPasswordWithOldPassword(
      values.old_password,
      values.new_password,
      values.confirm_new_password
    );
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(
        response?.data?.message || "Password updated successfully."
      );
      removeToken();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(
        response?.message || "Failed to update password. Please try again."
      );
    }
    setUpdatingPassword(false);
    setOpenPasswordResetModal(false);
    form.reset();
  };

  // ------------------------------------------------
  // Send verification email
  // ------------------------------------------------
  const handleEmailVerification = async () => {
    setSendingCode(true);
    if (!userProfile?.email) {
      toast.error("Oops! Email not found!");
      return;
    }
    const response = await useResendVerificationEmail(userProfile?.email);
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Code sent successfully!");
      removeToken();
      persistRedirect(pathname);
      setTimeout(() => {
        router.push("/verify-email");
      }, 2000);
    } else {
      toast.error(response?.data?.message || "Failed to send code!");
    }
    setSendingCode(false);
  };

  // ------------------------------------------------
  // Enable or disable 2FA
  // ------------------------------------------------
  const toggle2FA = async (action: "enable" | "disable") => {
    setSubmitting(true);

    const response =
      action === "enable" ? await useEnable2FA() : await useDisable2FA();

    if (response?.status >= 200 && response?.status < 300) {
      toast.success(
        response?.data?.message ||
          `Two-factor authentication ${action}d successfully.`
      );
    } else {
      toast.error(
        response?.message || `Failed to ${action} two-factor authentication.`
      );
    }
    setSubmitting(false);
    setOpen2FAModal(false);
    refetch();
  };

  return (
    <div className={cn("flex flex-col gap-6 mt-4", className)} {...props}>
      <Card className="py-10 pt-6 px-3">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Security Features</CardTitle>
          <CardDescription>
            Manage your account security settings and features here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* password reset section */}
            <div className="flex justify-between border-b pb-4">
              <div className="">
                <h2 className="text-lg font-semibold">Password Reset</h2>
                <p className="text-sm text-muted-foreground">
                  Change your password to keep your account secure.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenPasswordResetModal(true)}
                disabled={updatingPassword}
              >
                Change
              </Button>
            </div>

            {/* Email Verified section */}
            <div className="flex justify-between border-b pb-4">
              <div className="">
                <h2 className="text-lg font-semibold">Email Verification</h2>
                <p className="text-sm text-muted-foreground">
                  Verify your email address to ensure account security.
                </p>
              </div>
              <div>
                {userProfile?.is_verified ? (
                  <div className="flex gap-2 items-center bg-green-100 border border-green-700 rounded-full px-2 py-0.5 text-sm text-green-700">
                    <RiVerifiedBadgeFill className="text-green-700" />
                    Verified
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sendingCode}
                    onClick={handleEmailVerification}
                  >
                    {sendingCode ? (
                      <LoadingSpinner message="sending..." />
                    ) : (
                      <span>Verify Email</span>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* 2FA section */}
            <div className="flex justify-between border-b pb-4">
              <div className="">
                <h2 className="text-lg font-semibold">Enable 2FA</h2>
                <p className="text-sm text-muted-foreground">
                  Enable two-factor authentication for added security.
                </p>
              </div>
              <div>
                <Switch
                  checked={userProfile.two_factor_enabled}
                  onCheckedChange={() => {
                    setOpen2FAModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogModal
        open={open2FAModal}
        setOpen={setOpen2FAModal}
        title="Two-Factor Authentication"
        description="Enable or disable two-factor authentication for your account."
        showFooter={false}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-4 bg-zinc-100 p-2 rounded-md">
            Two-factor authentication adds an extra layer of security to your
            account. When enabled, you will need to provide a verification code
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                toggle2FA(
                  userProfile.two_factor_enabled ? "disable" : "enable"
                );
              }}
              disabled={submitting}
            >
              {submitting ? (
                <LoadingSpinner message="submitting..." />
              ) : userProfile.two_factor_enabled ? (
                "Disable 2FA"
              ) : (
                "Enable 2FA"
              )}
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setOpen2FAModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogModal>

      <DialogModal
        open={openPasswordResetModal}
        setOpen={() => {
          setOpenPasswordResetModal(false);
          form.reset();
        }}
        title="Reset Password"
        description="Change your password to keep your account secure."
        showFooter={false}
      >
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordReset)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={updatingPassword}>
                  {updatingPassword ? (
                    <LoadingSpinner message="updating..." />
                  ) : (
                    <span>Update Password</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => {
                    setOpenPasswordResetModal(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogModal>
    </div>
  );
};

export default Settings;
