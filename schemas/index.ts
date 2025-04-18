import { z } from "zod";

export const RoleEnum = z.enum(["admin", "user"]);

export const UserCreateSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
  

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const EmailModelSchema = z.object({
  addresses: z.array(z.string().email()),
});


export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const verify2FASchema = z.object({
  code: z.string().min(6, "Enter a valid code"),
});

// Schema for password reset form
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  gender: z.string().optional().nullable(),
  role: RoleEnum.default("user"),
});

export type UserResponseType = z.infer<typeof UserResponseSchema>;


export const UserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  role: RoleEnum.default("user"),
  is_verified: z.boolean().default(false),
  two_factor_enabled: z.boolean().default(false),
  is_oauth: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type UserType = z.infer<typeof UserSchema>

export const UserUpdateSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
});

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
