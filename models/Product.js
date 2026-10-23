import mongoose from "mongoose";

export const SKIN_TYPES = ["oily", "dry", "combination", "normal", "sensitive"];
export const CONCERNS = ["acne", "dark-spots", "dullness", "dehydration", "redness", "pores", "aging", "sun-protection"];

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: [true, "Brand is required"], trim: true, maxlength: 40, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: [true, "Category is required"], index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    howToUse: { type: String, trim: true, maxlength: 1000, default: "" },
    keyIngredients: [{ type: String, trim: true, maxlength: 60 }],
    size: { type: String, trim: true, maxlength: 20, default: "" },
    origin: { type: String, trim: true, maxlength: 40, default: "South Korea" },
    skinTypes: [{ type: String, enum: SKIN_TYPES }],
    concerns: [{ type: String, enum: CONCERNS }],
    images: {
      type: [String],
      validate: [(value) => value.length >= 1 && value.length <= 6, "Add between 1 and 6 images"],
    },
    price: { type: Number, required: true, min: 1, index: true },
    compareAtPrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0, index: true },
    reviewCount: { type: Number, min: 0, default: 0 },
    soldCount: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["published", "draft"], default: "published", index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ title: "text", brand: "text", shortDescription: "text", keyIngredients: "text" });

export const Product = mongoose.model("Product", productSchema);
