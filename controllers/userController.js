import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex, pageMeta, paging, sortFrom } from "../utils/helpers.js";

export async function updateProfile(req, res) {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ success: true, user: req.user });
}

export async function updatePreferences(req, res) {
  req.user.preferences = req.body;
  await req.user.save();
  res.json({ success: true, user: req.user });
}

export async function changePassword(req, res) {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest("Please fix the highlighted fields.", { currentPassword: "Current password is incorrect" });
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
}

export async function listUsers(req, res) {
  const { page, limit, skip } = paging(req.query, 10, 50);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  const sort = sortFrom(req.query.sort, ["name", "email", "createdAt", "role", "lastLoginAt"], { createdAt: -1 });
  const [users, total] = await Promise.all([
    User.find(filter).sort({ ...sort, _id: 1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  const ids = users.map((u) => u._id);
  const orderCounts = await Order.aggregate([
    { $match: { user: { $in: ids } } },
    { $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 0, "$total"] } } } },
  ]);
  const byId = Object.fromEntries(orderCounts.map((o) => [o._id.toString(), o]));
  const items = users.map(({ password: _password, ...u }) => ({
    ...u,
    orders: byId[u._id.toString()]?.orders || 0,
    spent: byId[u._id.toString()]?.spent || 0,
  }));
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw ApiError.notFound("User not found");
  delete user.password;
  const [orders, listings, reviews] = await Promise.all([
    Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).select("orderNumber total status createdAt").lean(),
    Product.countDocuments({ seller: user._id }),
    Review.countDocuments({ user: user._id }),
  ]);
  res.json({ success: true, item: { ...user, recentOrders: orders, listings, reviews } });
}

export async function adminUpdateUser(req, res) {
  if (req.params.id === req.user._id.toString()) {
    throw ApiError.badRequest("You cannot change your own role or status.");
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!user) throw ApiError.notFound("User not found");
  res.json({ success: true, item: user });
}

export async function deleteUser(req, res) {
  if (req.params.id === req.user._id.toString()) throw ApiError.badRequest("You cannot delete your own account here.");
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  if (await Order.exists({ user: user._id })) {
    throw ApiError.conflict("This user has orders on record. Block the account instead of deleting it.");
  }
  await Promise.all([user.deleteOne(), Product.deleteMany({ seller: user._id }), Review.deleteMany({ user: user._id })]);
  res.json({ success: true, message: "User deleted" });
}
