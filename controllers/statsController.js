import { Category } from "../models/Category.js";
import { Message } from "../models/misc.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

const NOT_CANCELLED = { status: { $ne: "cancelled" } };

function monthsBack(n) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (n - 1));
  return start;
}

function monthKeys(n) {
  const start = monthsBack(n);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleString("en", { month: "short" }) };
  });
}

/** Public numbers for the homepage. */
export async function publicStats(_req, res) {
  const [products, brands, customers, delivered, ratingAgg] = await Promise.all([
    Product.countDocuments({ status: "published" }),
    Product.distinct("brand", { status: "published" }),
    User.countDocuments({ role: "user" }),
    Order.countDocuments({ status: "delivered" }),
    Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]),
  ]);
  res.json({
    success: true,
    stats: {
      products,
      brands: brands.length,
      customers,
      ordersDelivered: delivered,
      averageRating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
      reviews: ratingAgg[0]?.count || 0,
    },
  });
}

/** Admin overview: cards + chart series, all computed from the database. */
export async function adminStats(req, res) {
  const months = Math.min(12, Math.max(3, Number(req.query.months) || 6));
  const since = monthsBack(months);
  const [totals, revenueAgg, monthly, byStatus, byCategory, topProducts, newUsers, newMessages, recentOrders] = await Promise.all([
    Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
    ]),
    Order.aggregate([{ $match: NOT_CANCELLED }, { $group: { _id: null, revenue: { $sum: "$total" }, avg: { $avg: "$total" } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 0, "$total"] } },
        },
      },
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: NOT_CANCELLED },
      { $unwind: "$items" },
      { $group: { _id: "$items.category", revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, units: { $sum: "$items.quantity" } } },
      { $sort: { revenue: -1 } },
    ]),
    Order.aggregate([
      { $match: NOT_CANCELLED },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", title: { $first: "$items.title" }, units: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
      { $sort: { units: -1 } },
      { $limit: 5 },
    ]),
    User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    Message.countDocuments({ status: "new" }),
    Order.find().populate("user", "name").sort({ createdAt: -1 }).limit(5).select("orderNumber total status createdAt user").lean(),
  ]);

  const [totalProducts, totalUsers, totalOrders, totalCategories] = totals;
  const byMonth = Object.fromEntries(monthly.map((m) => [m._id, m]));
  const usersByMonth = Object.fromEntries(newUsers.map((m) => [m._id, m.count]));

  res.json({
    success: true,
    cards: {
      totalProducts,
      totalUsers,
      totalOrders,
      totalCategories,
      revenue: revenueAgg[0]?.revenue || 0,
      averageOrder: Math.round(revenueAgg[0]?.avg || 0),
      newMessages,
    },
    monthly: monthKeys(months).map(({ key, label }) => ({
      month: label,
      orders: byMonth[key]?.orders || 0,
      revenue: byMonth[key]?.revenue || 0,
      newUsers: usersByMonth[key] || 0,
    })),
    ordersByStatus: byStatus.map((s) => ({ name: s._id, value: s.count })),
    revenueByCategory: byCategory.map((c) => ({ name: c._id || "Other", revenue: c.revenue, units: c.units })),
    topProducts: topProducts.map((p) => ({ id: p._id, title: p.title, units: p.units, revenue: p.revenue })),
    recentOrders,
  });
}

/** Signed-in user's own overview. */
export async function myStats(req, res) {
  const userId = req.user._id;
  const since = monthsBack(6);
  const [orderAgg, statusAgg, monthly, listings, listingViews, reviews, categories] = await Promise.all([
    Order.aggregate([{ $match: { user: userId, ...NOT_CANCELLED } }, { $group: { _id: null, spent: { $sum: "$total" }, count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { user: userId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { user: userId, createdAt: { $gte: since }, ...NOT_CANCELLED } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, spent: { $sum: "$total" }, orders: { $sum: 1 } } },
    ]),
    Product.countDocuments({ seller: userId }),
    Product.aggregate([{ $match: { seller: userId } }, { $group: { _id: null, sold: { $sum: "$soldCount" } } }]),
    Review.countDocuments({ user: userId }),
    Order.aggregate([
      { $match: { user: userId, ...NOT_CANCELLED } },
      { $unwind: "$items" },
      { $group: { _id: "$items.category", units: { $sum: "$items.quantity" } } },
      { $sort: { units: -1 } },
    ]),
  ]);
  const byMonth = Object.fromEntries(monthly.map((m) => [m._id, m]));
  res.json({
    success: true,
    cards: {
      orders: statusAgg.reduce((sum, s) => sum + s.count, 0),
      spent: orderAgg[0]?.spent || 0,
      listings,
      unitsSold: listingViews[0]?.sold || 0,
      reviews,
    },
    monthly: monthKeys(6).map(({ key, label }) => ({ month: label, spent: byMonth[key]?.spent || 0, orders: byMonth[key]?.orders || 0 })),
    ordersByStatus: statusAgg.map((s) => ({ name: s._id, value: s.count })),
    categories: categories.map((c) => ({ name: c._id || "Other", value: c.units })),
  });
}
