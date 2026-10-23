import sharp from "sharp";
import { env } from "../config/env.js";
import { Image, Message, Post, Setting, Subscriber } from "../models/misc.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex, pageMeta, paging, sortFrom } from "../utils/helpers.js";

/* ---------- Contact messages ---------- */

export async function createMessage(req, res) {
  await Message.create(req.body);
  res.status(201).json({ success: true, message: "Thanks! Your message has been received. We reply within one working day." });
}

export async function listMessages(req, res) {
  const { page, limit, skip } = paging(req.query, 10, 50);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }, { subject: rx }];
  }
  const sort = sortFrom(req.query.sort, ["createdAt", "name", "status"], { createdAt: -1 });
  const [items, total] = await Promise.all([
    Message.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function updateMessage(req, res) {
  const item = await Message.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!item) throw ApiError.notFound("Message not found");
  res.json({ success: true, item });
}

export async function deleteMessage(req, res) {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound("Message not found");
  res.json({ success: true, message: "Message deleted" });
}

/* ---------- Newsletter ---------- */

export async function subscribe(req, res) {
  const existing = await Subscriber.findOne({ email: req.body.email });
  if (existing) return res.json({ success: true, message: "You're already on the list. Thank you!" });
  await Subscriber.create(req.body);
  res.status(201).json({ success: true, message: "Subscribed! Look out for our next skincare letter." });
}

/* ---------- Blog ---------- */

export async function listPosts(req, res) {
  const { page, limit, skip } = paging(req.query, 9, 30);
  const filter = req.query.tag ? { tags: req.query.tag } : {};
  const [items, total] = await Promise.all([
    Post.find(filter).select("-content").populate("author", "name avatar").sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
  ]);
  res.json({ success: true, items, ...pageMeta(total, page, limit) });
}

export async function getPost(req, res) {
  const item = await Post.findOne({ slug: req.params.slug }).populate("author", "name avatar").lean();
  if (!item) throw ApiError.notFound("Article not found");
  const more = await Post.find({ _id: { $ne: item._id } }).select("title slug cover excerpt readMinutes publishedAt").sort({ publishedAt: -1 }).limit(3).lean();
  res.json({ success: true, item, more });
}

/* ---------- Images ---------- */

/** Resizes the upload to a WebP no larger than 1200px and stores it. */
export async function uploadImage(req, res) {
  if (!req.file) throw ApiError.badRequest("Choose an image to upload.");
  const maxSize = req.query.purpose === "avatar" ? 400 : 1200;
  const pipeline = sharp(req.file.buffer).rotate().resize(maxSize, maxSize, { fit: req.query.purpose === "avatar" ? "cover" : "inside", withoutEnlargement: true }).webp({ quality: 80 });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  const image = await Image.create({ data, width: info.width, height: info.height, size: info.size, owner: req.user._id });
  res.status(201).json({ success: true, url: `${env.publicUrl}/api/images/${image._id}`, width: info.width, height: info.height });
}

export async function serveImage(req, res) {
  const image = await Image.findById(req.params.id).select("data contentType");
  if (!image) throw ApiError.notFound("Image not found");
  res.set("Content-Type", image.contentType);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.send(image.data);
}

/* ---------- Store settings ---------- */

export async function getSettings(_req, res) {
  res.json({ success: true, item: await Setting.getStore() });
}

export async function updateSettings(req, res) {
  const item = await Setting.findOneAndUpdate({ key: "store" }, req.body, { returnDocument: "after", upsert: true, runValidators: true });
  res.json({ success: true, item });
}
