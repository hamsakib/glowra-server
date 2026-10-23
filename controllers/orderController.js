import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Setting } from "../models/misc.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex, pageMeta, paging, sortFrom } from "../utils/helpers.js";

function isDhaka(city) {
  return /dhaka/i.test(city);
}

async function nextOrderNumber() {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments({ orderNumber: new RegExp(`^GLW-${year}-`) });
  return `GLW-${year}-${String(count + 1).padStart(5, "0")}`;
}

/** Places a cash-on-delivery order. Prices come from the database, never from the client. */
export async function createOrder(req, res) {
  const { items, shipping } = req.body;
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids }, status: "published" }).populate("category", "name");
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  const lines = items.map((line) => {
    const product = byId.get(line.product);
    if (!product) throw ApiError.badRequest("One of the products in your cart is no longer available.");
    if (product.stock < line.quantity) {
      throw ApiError.badRequest(`Only ${product.stock} left of ${product.title}.`);
    }
    return {
      product: product._id,
      title: product.title,
      image: product.images[0],
      category: product.category?.name || "",
      price: product.price,
      quantity: line.quantity,
    };
  });

  const settings = await Setting.getStore();
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const fee = isDhaka(shipping.city) ? settings.shippingFeeDhaka : settings.shippingFeeOutside;
  const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : fee;

  const order = await Order.create({
    orderNumber: await nextOrderNumber(),
    user: req.user._id,
    items: lines,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    shipping,
  });

  await Product.bulkWrite(
    lines.map((l) => ({
      updateOne: { filter: { _id: l.product }, update: { $inc: { stock: -l.quantity, soldCount: l.quantity } } },
    })),
  );

  res.status(201).json({ success: true, item: order });
}

function tableFilter(query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.q) filter.orderNumber = new RegExp(escapeRegex(query.q.trim()), "i");
  return filter;
}

export async function myOrders(req, res) {
  const { page, limit, skip } = paging(req.query, 10, 50);
  const filter = { ...tableFilter(req.query), user: req.user._id };
  const sort = sortFrom(req.query.sort, ["createdAt", "total", "status"], { createdAt: -1 });
  const [items, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id).populate("user", "name email phone").lean();
  if (!order) throw ApiError.notFound("Order not found");
  if (req.user.role !== "admin" && !order.user._id.equals(req.user._id)) throw ApiError.notFound("Order not found");
  res.json({ success: true, item: order });
}

export async function allOrders(req, res) {
  const { page, limit, skip } = paging(req.query, 10, 50);
  const filter = tableFilter(req.query);
  const sort = sortFrom(req.query.sort, ["createdAt", "total", "status"], { createdAt: -1 });
  const [items, total] = await Promise.all([
    Order.find(filter).populate("user", "name email").sort(sort).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");
  const wasCancelled = order.status === "cancelled";
  order.status = req.body.status;
  await order.save();
  // Cancelling returns stock; un-cancelling takes it again.
  if (wasCancelled !== (order.status === "cancelled")) {
    const sign = order.status === "cancelled" ? 1 : -1;
    await Product.bulkWrite(
      order.items.map((l) => ({
        updateOne: { filter: { _id: l.product }, update: { $inc: { stock: sign * l.quantity, soldCount: -sign * l.quantity } } },
      })),
    );
  }
  res.json({ success: true, item: order });
}

/** Customer can cancel their own order while it is still pending. */
export async function cancelMyOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw ApiError.notFound("Order not found");
  if (order.status !== "pending") throw ApiError.badRequest("Only pending orders can be cancelled.");
  req.body = { status: "cancelled" };
  return updateOrderStatus(req, res);
}
