import { z } from "zod";

// Custom validation function
export const imageSchema = z.union([
    z.string().url("Invalid image URL"), // Allowing URL
    z.instanceof(File, { message: "Invalid file type" }), // Allowing File upload
  ]);

// Reusable optional email schema
export const optionalEmailSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Invalid email address.",
  });

// Reusable optional URL schema
export const optionalUrlSchema = z
  .string()
  .optional()
  .refine(
    (value) =>
      !value || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(value),
    { message: "Invalid URL." }
  );

// Resuable optional number schema
export const optionalNumberSchema = z
    .string()
    .optional()
    .refine((value) => !value || !isNaN(parseFloat(value)), {
        message: "Value must be a valid number.",
    })
    .transform((val) => parseFloat(val!)); // Convert string to number

export const NumberSchema = z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
        message: "Value must be a valid number.",
    })
    .transform((val) => parseFloat(val)); // Convert string to number

// Reusable optional phone number schema
export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{11}$/.test(value), {
    message: "Invalid phone number.",
  });

export const PhoneSchema = z
    .string()
    .refine((value) => /^\d{11}$/.test(value), {
        message: "Invalid phone number.",
    });

// Reusable optional date schema
export const optionalDateSchema = z
    .string()
    .optional()
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Invalid date.",
    });

export const DateSchema = z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Invalid date.",
    });

// Reusable optional time schema
export const optionalTimeSchema = z
    .string()
    .optional()
    .refine((value) => !value || /^\d{2}:\d{2}$/.test(value), {
        message: "Invalid time.",
    });

export const TimeSchema = z
    .string()
    .refine((value) => /^\d{2}:\d{2}$/.test(value), {
        message: "Invalid time.",
    });

// Reusable optional amount schema
export const optionalAmountSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Amount must be a valid number.",
  })
  .transform((val) => parseFloat(val!)) // Convert string to number
  .refine((val) => val > 0, { message: "Amount must be a positive number." })
  .refine((val) => val >= 0.01, { message: "Amount must be greater than 0." });

export const AmountSchema = z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
        message: "Amount must be a valid number.",
    })
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine((val) => val > 0, { message: "Amount must be a positive number." })
    .refine((val) => val >= 0.01, { message: "Amount must be greater than 0." });
