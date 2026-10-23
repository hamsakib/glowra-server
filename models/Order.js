import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], validate: [(v) => v.length > 0, "Order needs at least one item"] },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    shipping: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      note: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true, versionKey: false },
);

export const Order = mongoose.model("Order", orderSchema);
