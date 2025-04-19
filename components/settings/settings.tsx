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
import { z } from "zod";
import { UserType, UserUpdateSchema } from "@/schemas";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Switch } from "../ui/switch";
import { useGetUserProfile } from "@/api/user";

const Settings = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { data: userProfile } = useGetUserProfile() as {
    data: UserType;
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
              <Button variant="outline" size="sm">
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
                  <Button variant="outline" size="sm">
                    Verify
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
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
