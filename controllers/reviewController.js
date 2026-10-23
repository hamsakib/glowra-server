import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { pageMeta, paging, toObjectId } from "../utils/helpers.js";

export async function listReviews(req, res) {
  const { page, limit, skip } = paging(req.query, 5, 20);
  const filter = { product: req.params.productId };
  const [items, total, breakdown] = await Promise.all([
    Review.find(filter).populate("user", "name avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments(filter),
    Review.aggregate([{ $match: { product: toObjectId(req.params.productId) } }, { $group: { _id: "$rating", count: { $sum: 1 } } }]),
  ]);
  const stars = Object.fromEntries([5, 4, 3, 2, 1].map((n) => [n, breakdown.find((b) => b._id === n)?.count || 0]));
  res.json({ success: true, items, stars, ...pageMeta(total, page, limit) });
}

export async function createReview(req, res) {
  const product = await Product.findById(req.params.productId).select("_id seller");
  if (!product) throw ApiError.notFound("Product not found");
  if (product.seller.equals(req.user._id)) throw ApiError.badRequest("You cannot review your own listing.");
  if (await Review.exists({ product: product._id, user: req.user._id })) {
    throw ApiError.conflict("You have already reviewed this product.");
  }
  const review = await Review.create({ ...req.body, product: product._id, user: req.user._id });
  await Review.syncProductRating(product._id);
  await review.populate("user", "name avatar");
  res.status(201).json({ success: true, item: review });
}

export async function deleteReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound("Review not found");
  if (req.user.role !== "admin" && !review.user.equals(req.user._id)) throw ApiError.forbidden();
  await review.deleteOne();
  await Review.syncProductRating(review.product);
  res.json({ success: true, message: "Review deleted" });
}

/** Highest-rated recent reviews with a decent length, for homepage testimonials. */
export async function topReviews(_req, res) {
  const items = await Review.find({ rating: 5, $expr: { $gte: [{ $strLenCP: "$comment" }, 80] } })
    .populate("user", "name avatar city")
    .populate("product", "title slug images")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  res.json({ success: true, items });
}

/** Whether the current user bought this product (shows a "verified buyer" note). */
export async function canReview(req, res) {
  const [bought, reviewed] = await Promise.all([
    Order.exists({ user: req.user._id, status: "delivered", "items.product": req.params.productId }),
    Review.exists({ user: req.user._id, product: req.params.productId }),
  ]);
  res.json({ success: true, verifiedBuyer: Boolean(bought), reviewed: Boolean(reviewed) });
}
