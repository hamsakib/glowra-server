import { z } from "zod";
import { CONCERNS, SKIN_TYPES } from "../models/Product.js";
import { ORDER_STATUSES } from "../models/Order.js";

const email = z.email("Enter a valid email address").trim().toLowerCase();
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

// At least 8 characters with an uppercase letter, a lowercase letter and a number.
export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be 72 characters or fewer")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/\d/, "Password needs a number");

const bdPhone = z
  .string()
  .trim()
  .regex(/^(\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z.union([bdPhone, z.literal("")]).optional(),
  city: z.string().trim().max(40).optional(),
  address: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(280, "Bio must be 280 characters or fewer").optional(),
  skinType: z.enum(["", ...SKIN_TYPES]).optional(),
  avatar: z.union([z.literal(""), z.string().trim().max(500).refine((v) => /^https?:\/\//.test(v), "Avatar must be an image URL")]).optional(),
});

export const preferencesSchema = z.object({
  newsletter: z.boolean(),
  orderUpdates: z.boolean(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current one",
  });

const imageUrl = z
  .string()
  .trim()
  .refine((value) => /^https?:\/\//.test(value), "Image must be a valid http(s) URL");

export const productSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  brand: z.string().trim().min(2, "Brand is required").max(40),
  category: objectId,
  shortDescription: z.string().trim().min(20, "Short description must be at least 20 characters").max(160),
  description: z.string().trim().min(60, "Description must be at least 60 characters").max(4000),
  howToUse: z.string().trim().max(1000).optional().default(""),
  keyIngredients: z.array(z.string().trim().min(2).max(60)).max(8).optional().default([]),
  size: z.string().trim().max(20).optional().default(""),
  skinTypes: z.array(z.enum(SKIN_TYPES)).optional().default([]),
  concerns: z.array(z.enum(CONCERNS)).optional().default([]),
  images: z.array(imageUrl).min(1, "Add at least one image").max(6, "Up to 6 images"),
  price: z.coerce.number().int("Price must be a whole number").min(50, "Price must be at least ৳50").max(100000),
  compareAtPrice: z.coerce.number().int().min(0).max(100000).optional().default(0),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").max(10000),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export const adminProductPatchSchema = z.object({
  featured: z.boolean().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(40),
  description: z.string().trim().max(200).optional().default(""),
  image: z.union([imageUrl, z.literal("")]).optional().default(""),
  order: z.coerce.number().int().min(0).max(100).optional().default(0),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(80).optional().default(""),
  comment: z.string().trim().min(10, "Review must be at least 10 characters").max(1000),
});

export const orderSchema = z.object({
  items: z
    .array(z.object({ product: objectId, quantity: z.coerce.number().int().min(1).max(10) }))
    .min(1, "Your cart is empty")
    .max(20),
  shipping: z.object({
    name: z.string().trim().min(2, "Name is required").max(60),
    phone: bdPhone,
    city: z.string().trim().min(2, "City is required").max(40),
    address: z.string().trim().min(10, "Enter your full address").max(200),
    note: z.string().trim().max(200).optional().default(""),
  }),
});

export const orderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export const userAdminSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  status: z.enum(["active", "blocked"]).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email,
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(100),
  message: z.string().trim().min(20, "Message must be at least 20 characters").max(2000),
});

export const messageStatusSchema = z.object({ status: z.enum(["new", "read", "resolved"]) });

export const newsletterSchema = z.object({ email });

export const settingsSchema = z.object({
  storeName: z.string().trim().min(2).max(40),
  supportEmail: email,
  supportPhone: z.string().trim().min(6).max(20),
  address: z.string().trim().min(5).max(120),
  shippingFeeDhaka: z.coerce.number().int().min(0).max(1000),
  shippingFeeOutside: z.coerce.number().int().min(0).max(1000),
  freeShippingThreshold: z.coerce.number().int().min(0).max(100000),
  announcement: z.string().trim().max(140).optional().default(""),
});
