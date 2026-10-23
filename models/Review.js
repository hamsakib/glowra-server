import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 80, default: "" },
    comment: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false },
);

// One review per user per product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

/** Recomputes the product's average rating and review count. */
reviewSchema.statics.syncProductRating = async function syncProductRating(productId) {
  const [stats] = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await mongoose.model("Product").findByIdAndUpdate(productId, {
    rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
    reviewCount: stats ? stats.count : 0,
  });
};

export const Review = mongoose.model("Review", reviewSchema);
