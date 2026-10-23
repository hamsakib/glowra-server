import mongoose from "mongoose";

/** Contact-form submissions. */
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new", index: true },
  },
  { timestamps: true, versionKey: false },
);
export const Message = mongoose.model("Message", messageSchema);

const subscriberSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, trim: true, lowercase: true } },
  { timestamps: true, versionKey: false },
);
export const Subscriber = mongoose.model("Subscriber", subscriberSchema);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    tags: [String],
    readMinutes: { type: Number, default: 4 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);
export const Post = mongoose.model("Post", postSchema);

/** Uploaded images (avatars, product photos), stored as optimised WebP. */
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, default: "image/webp" },
    width: Number,
    height: Number,
    size: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false },
);
export const Image = mongoose.model("Image", imageSchema);

/** Single store-wide settings document, edited by admins. */
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "store", unique: true },
    storeName: { type: String, default: "Glowra", trim: true },
    supportEmail: { type: String, default: "hamsakib03@gmail.com", trim: true },
    supportPhone: { type: String, default: "+880 1842-001223", trim: true },
    address: { type: String, default: "Dhaka, Bangladesh", trim: true },
    shippingFeeDhaka: { type: Number, default: 70, min: 0 },
    shippingFeeOutside: { type: Number, default: 130, min: 0 },
    freeShippingThreshold: { type: Number, default: 3000, min: 0 },
    announcement: { type: String, default: "", trim: true, maxlength: 140 },
  },
  { timestamps: true, versionKey: false },
);
settingSchema.statics.getStore = async function getStore() {
  return (await this.findOne({ key: "store" })) || this.create({ key: "store" });
};
export const Setting = mongoose.model("Setting", settingSchema);
