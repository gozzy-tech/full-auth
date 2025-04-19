"use client";
import React, { useEffect, useState } from "react";
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
import { UserUpdateSchema, UserUpdateType } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "../custom/imageuploader";
import { useGetUserProfile, useUpdateUserProfile } from "@/api/user";
import { toast } from "sonner";

const Profile = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { data: userProfile } = useGetUserProfile();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      bio: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
      avatar: "",
    },
  });

  const { reset } = form;

  // Set default values from userProfile data if available
  useEffect(() => {
    if (userProfile) {
      reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        gender: userProfile.gender || "",
        bio: userProfile.bio || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        avatar: userProfile.avatar || "",
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: Partial<UserUpdateType>) => {
    setSubmitting(true);
    try {
      // remove email field if it's unchanged
      if (data.email === userProfile?.email) {
        delete data.email;
      }
      const response = await updateUserProfile(data);
      if (response) {
        reset(response?.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 mt-4", className)} {...props}>
      <Card className="py-10 pt-6 px-3">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Update your profile</CardTitle>
          <CardDescription>
            Update your profile information to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div>
                {/* Avatar */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="enter a short bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <LoadingSpinner message="updating..." />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
