import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/helpers.js";

/** Categories with their live product counts. */
export async function listCategories(_req, res) {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).lean(),
    Product.aggregate([{ $match: { status: "published" } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);
  const byId = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
  res.json({
    success: true,
    items: categories.map((c) => ({ ...c, productCount: byId[c._id.toString()] || 0 })),
  });
}

export async function createCategory(req, res) {
  const category = await Category.create({ ...req.body, slug: slugify(req.body.name) });
  res.status(201).json({ success: true, item: category });
}

export async function updateCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound("Category not found");
  Object.assign(category, req.body, { slug: slugify(req.body.name) });
  await category.save();
  res.json({ success: true, item: category });
}

export async function deleteCategory(req, res) {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse) {
    throw ApiError.conflict(`This category still has ${inUse} product${inUse === 1 ? "" : "s"}. Move them first.`);
  }
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound("Category not found");
  res.json({ success: true, message: "Category deleted" });
}
