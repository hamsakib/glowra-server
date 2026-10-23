import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex, pageMeta, paging, slugify, sortFrom } from "../utils/helpers.js";

const LIST_FIELDS = "title slug brand category shortDescription images price compareAtPrice rating reviewCount stock size featured status createdAt soldCount";
const SORTS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
  popular: { soldCount: -1 },
};

/** Builds a Mongo filter from explore-page query params. */
async function buildFilter(query) {
  const filter = { status: "published" };
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q.trim()), "i");
    filter.$or = [{ title: rx }, { brand: rx }, { shortDescription: rx }, { keyIngredients: rx }];
  }
  if (query.category) {
    const slugs = String(query.category).split(",");
    const categories = await Category.find({ slug: { $in: slugs } }).select("_id");
    filter.category = { $in: categories.map((c) => c._id) };
  }
  if (query.brand) filter.brand = { $in: String(query.brand).split(",") };
  if (query.skinType) filter.skinTypes = { $in: String(query.skinType).split(",") };
  if (query.concern) filter.concerns = { $in: String(query.concern).split(",") };
  const min = Number(query.minPrice);
  const max = Number(query.maxPrice);
  if (min > 0 || max > 0) {
    filter.price = {};
    if (min > 0) filter.price.$gte = min;
    if (max > 0) filter.price.$lte = max;
  }
  const rating = Number(query.rating);
  if (rating > 0) filter.rating = { $gte: rating };
  if (query.inStock === "true") filter.stock = { $gt: 0 };
  return filter;
}

export async function listProducts(req, res) {
  const { page, limit, skip } = paging(req.query, 12, 48);
  const filter = await buildFilter(req.query);
  const sort = SORTS[req.query.sort] || SORTS.newest;
  const [items, total] = await Promise.all([
    Product.find(filter).select(LIST_FIELDS).populate("category", "name slug").sort({ ...sort, _id: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function featuredProducts(_req, res) {
  const items = await Product.find({ status: "published", featured: true })
    .select(LIST_FIELDS)
    .populate("category", "name slug")
    .sort({ soldCount: -1 })
    .limit(8)
    .lean();
  res.json({ success: true, items });
}

/** Options for the explore-page filters, computed from live data. */
export async function filterOptions(_req, res) {
  const [brands, priceRange, categories] = await Promise.all([
    Product.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Product.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
    ]),
    Category.find().sort({ order: 1, name: 1 }).select("name slug").lean(),
  ]);
  res.json({
    success: true,
    brands: brands.map((b) => ({ name: b._id, count: b.count })),
    price: priceRange[0] ? { min: priceRange[0].min, max: priceRange[0].max } : { min: 0, max: 0 },
    categories,
  });
}

export async function getProduct(req, res) {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .populate("seller", "name avatar createdAt role")
    .lean();
  if (!product) throw ApiError.notFound("Product not found");
  const isOwner = req.user && (req.user.role === "admin" || req.user._id.equals(product.seller._id));
  if (product.status !== "published" && !isOwner) throw ApiError.notFound("Product not found");
  res.json({ success: true, item: product });
}

export async function relatedProducts(req, res) {
  const product = await Product.findOne({ slug: req.params.slug }).select("category concerns brand");
  if (!product) throw ApiError.notFound("Product not found");
  const items = await Product.find({
    _id: { $ne: product._id },
    status: "published",
    $or: [{ category: product.category }, { concerns: { $in: product.concerns } }],
  })
    .select(LIST_FIELDS)
    .populate("category", "name slug")
    .sort({ rating: -1 })
    .limit(4)
    .lean();
  res.json({ success: true, items });
}

async function uniqueSlug(title, ignoreId) {
  const base = slugify(title) || "product";
  let slug = base;
  for (let n = 2; await Product.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) }); n += 1) {
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createProduct(req, res) {
  if (!(await Category.exists({ _id: req.body.category }))) {
    throw ApiError.badRequest("Please fix the highlighted fields.", { category: "Choose a valid category" });
  }
  const product = await Product.create({
    ...req.body,
    slug: await uniqueSlug(req.body.title),
    seller: req.user._id,
  });
  res.status(201).json({ success: true, item: product });
}

async function findOwned(req) {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound("Product not found");
  if (req.user.role !== "admin" && !product.seller.equals(req.user._id)) {
    throw ApiError.forbidden("You can only change your own listings.");
  }
  return product;
}

/** Owner or admin: fetch one product by id, for the edit form. */
export async function getProductForEdit(req, res) {
  const product = await findOwned(req);
  res.json({ success: true, item: product });
}

export async function updateProduct(req, res) {
  const product = await findOwned(req);
  if (req.body.category && !(await Category.exists({ _id: req.body.category }))) {
    throw ApiError.badRequest("Please fix the highlighted fields.", { category: "Choose a valid category" });
  }
  if (req.body.title && req.body.title !== product.title) {
    product.slug = await uniqueSlug(req.body.title, product._id);
  }
  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, item: product });
}

/** Admin-only flags (featured / status). */
export async function adminPatchProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!product) throw ApiError.notFound("Product not found");
  res.json({ success: true, item: product });
}

export async function deleteProduct(req, res) {
  const product = await findOwned(req);
  await Promise.all([product.deleteOne(), Review.deleteMany({ product: product._id })]);
  res.json({ success: true, message: "Product deleted" });
}

/**
 * Table listing used by "My Listings" (scoped to the seller) and "Manage Products" (admin, all).
 * Supports search, category/status filters, sorting and pagination.
 */
export async function tableProducts(req, res, scope) {
  const { page, limit, skip } = paging(req.query, 10, 50);
  const filter = scope === "mine" ? { seller: req.user._id } : {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), "i");
    filter.$or = [{ title: rx }, { brand: rx }];
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  const sort = sortFrom(req.query.sort, ["title", "price", "stock", "rating", "createdAt", "soldCount"], { createdAt: -1 });
  const [items, total] = await Promise.all([
    Product.find(filter)
      .select(`${LIST_FIELDS} seller`)
      .populate("category", "name slug")
      .populate("seller", "name email")
      .sort({ ...sort, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}
