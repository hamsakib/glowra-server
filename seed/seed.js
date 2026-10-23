import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { Message, Post, Setting, Subscriber } from "../models/misc.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { slugify } from "../utils/helpers.js";
import { img, imagesFor } from "./data/images.js";
import { posts } from "./data/posts.js";
import { categories, products } from "./data/products.js";

export const DEMO_ACCOUNTS = {
  admin: { name: "Nadia Rahman", email: "admin@glowra.dev", password: "Admin@1234", role: "admin" },
  user: { name: "Tanvir Hasan", email: "user@glowra.dev", password: "User@1234", role: "user" },
};

// Sample customers so the dashboards have order history to chart. Passwords are random.
const CUSTOMERS = [
  ["Farzana Akter", "Dhaka", "combination"], ["Rafi Ahmed", "Chattogram", "oily"], ["Sadia Islam", "Dhaka", "dry"],
  ["Mehedi Karim", "Sylhet", "oily"], ["Nusrat Jahan", "Dhaka", "sensitive"], ["Ayesha Siddiqua", "Khulna", "normal"],
  ["Imran Hossain", "Rajshahi", "combination"], ["Tasnim Chowdhury", "Dhaka", "dry"], ["Zarin Tabassum", "Gazipur", "oily"],
  ["Arif Mahmud", "Dhaka", "normal"], ["Lamia Haque", "Narayanganj", "combination"], ["Shuvo Das", "Cumilla", "sensitive"],
];

const REVIEWS = {
  cleansers: [
    [5, "Finally no tight feeling", "I used to think squeaky meant clean. This leaves my face soft after washing and my T-zone is much less oily by afternoon. Lasts about three months with twice daily use."],
    [5, "Takes off sunscreen properly", "My sunscreen used to leave a film even after washing. Now it all comes off in one go and my skin does not feel stripped. Great for the evening cleanse."],
    [4, "Good but the tube goes fast", "Gentle and effective, no breakouts in the six weeks I have used it. Only complaint is I wish the bottle was bigger for the price."],
    [5, "Gentle on sensitive skin", "My skin reacts to most cleansers but this one has been completely fine. No redness, no itching, just clean and calm skin."],
  ],
  toners: [
    [5, "Calmed my redness", "I had red patches around my nose after trying an acid serum. Two weeks of patting this on twice a day and the redness has settled a lot."],
    [4, "Nice hydration layer", "Very watery so I layer it two or three times. My skin feels plumper in the air-conditioned office. Wish it came with a pump."],
    [5, "Skin looks smoother", "Using it on a cotton pad in the morning. Texture on my cheeks is smoother and makeup sits better. No stinging at all."],
    [5, "Repurchased already", "This is my second bottle. It is the one step I never skip because my skin feels thirsty without it."],
  ],
  serums: [
    [5, "My marks are fading", "Old acne marks on my cheeks are noticeably lighter after two months. I wear sunscreen every day too, which I think matters a lot."],
    [5, "Lightweight and absorbs fast", "No stickiness even in humid weather. Layers well under moisturizer and sunscreen, and a little goes a long way."],
    [4, "Works, but be patient", "Did not see much for the first three weeks. Around week six my skin started looking more even and less oily. Worth sticking with."],
    [5, "Fewer breakouts", "I get hormonal breakouts on my chin. Since adding this the spots are smaller and heal faster. No irritation so far."],
  ],
  moisturizers: [
    [5, "Perfect for oily skin", "I always skipped moisturizer because everything felt greasy. This sinks in quickly and my skin actually produces less oil now."],
    [5, "Saved my winter skin", "My cheeks used to flake every December. This kept them soft all season and I use it on my hands too."],
    [4, "Comfortable all day", "Nice texture, no smell, keeps my skin comfortable from morning till evening. Slightly pricey but the jar lasts."],
    [5, "Calming after sun", "Came back from a beach trip with irritated skin and this settled it within two days. Now it lives in my night routine."],
  ],
  sunscreen: [
    [5, "No white cast on my skin tone", "I have a medium-deep skin tone and every sunscreen used to make me look grey. This one disappears completely and does not feel heavy."],
    [5, "I actually reapply it now", "So light that I do not mind reapplying at lunch. That alone has made a difference to my tanning and dark spots."],
    [4, "Good under makeup", "Does not pill under foundation and does not sting my eyes. Slightly dewy finish so I set it with powder on very hot days."],
    [5, "Best sunscreen I have tried", "Tried at least six sunscreens over the years. This is the first one I finish and rebuy. Comfortable in heat and humidity."],
  ],
  masks: [
    [5, "Lips are soft every morning", "My lips get very dry in winter. A layer of this at night and they are smooth by morning. The jar lasts a long time."],
    [5, "Lifesaver for big pimples", "Put one on a painful spot before bed and by morning it was flatter and less red. Stops me from picking too."],
    [4, "Relaxing and refreshing", "I keep these in the fridge and use one after a long day. Skin feels calm and hydrated. Sheet fits my face well."],
    [5, "Great value pack", "Ten masks for the price is good. Noticeably calmer skin the next morning, especially around breakouts."],
  ],
};

const MESSAGES = [
  ["Rumana Kabir", "rumana.k@example.com", "Do you deliver outside Dhaka?", "Hi, I live in Rangpur and wanted to know how long delivery takes outside Dhaka and whether cash on delivery is available there too."],
  ["Shafiq Ullah", "shafiq.u@example.com", "Bulk order for a salon", "We run a small salon in Uttara and would like to order sunscreens and cleansers in bulk every month. Could someone share wholesale pricing?"],
  ["Mim Akter", "mim.akter@example.com", "Which sunscreen for oily skin?", "My skin gets very oily by noon. Between the Water-Fit Sun Serum and the Watery Sun Gel, which one would you recommend for everyday use?"],
];

/** Small deterministic PRNG so every seed run produces the same data. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function daysAgo(n, random) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + Math.floor(random() * 12), Math.floor(random() * 60), 0, 0);
  return d;
}

export async function seedDatabase({ log = () => {} } = {}) {
  const random = rng(20261023);

  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Review.deleteMany({}),
    Order.deleteMany({}), Post.deleteMany({}), Message.deleteMany({}), Subscriber.deleteMany({}), Setting.deleteMany({}),
  ]);
  await Promise.all([User.syncIndexes(), Product.syncIndexes(), Review.syncIndexes(), Order.syncIndexes()]);

  // Users
  const admin = await User.create({
    ...DEMO_ACCOUNTS.admin, phone: "01711000000", city: "Dhaka", bio: "Store manager at Glowra.", createdAt: daysAgo(200, random),
  });
  const demoUser = await User.create({
    ...DEMO_ACCOUNTS.user, phone: "01811000000", city: "Dhaka", address: "House 12, Road 5, Dhanmondi", skinType: "combination", createdAt: daysAgo(150, random),
  });
  const customers = [];
  for (const [i, [name, city, skinType]] of CUSTOMERS.entries()) {
    customers.push(
      await User.create({
        name,
        email: `${slugify(name).replace("-", ".")}@example.com`,
        password: `${crypto.randomBytes(9).toString("base64url")}A1`,
        city,
        skinType,
        createdAt: daysAgo(170 - i * 13, random),
      }),
    );
  }
  log(`users: ${2 + customers.length}`);

  // Categories
  const coverIndex = { cleansers: 0, toners: 0, serums: 6, moisturizers: 0, sunscreen: 0, masks: 0 };
  const categoryDocs = await Category.insertMany(
    categories.map((c) => ({ ...c, image: imagesFor(c.slug, coverIndex[c.slug])[0] })),
  );
  const categoryBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c]));
  log(`categories: ${categoryDocs.length}`);

  // Products
  const counters = {};
  const productDocs = await Product.insertMany(
    products.map((p, i) => {
      counters[p.category] = (counters[p.category] ?? -1) + 1;
      const { seller, ...rest } = p;
      return {
        ...rest,
        slug: slugify(p.title),
        category: categoryBySlug[p.category]._id,
        images: imagesFor(p.category, counters[p.category]),
        seller: seller === "user" ? demoUser._id : admin._id,
        createdAt: daysAgo(160 - i * 5, random),
      };
    }),
  );
  log(`products: ${productDocs.length}`);

  // Orders spread over the last six months; older orders are mostly delivered.
  const buyers = [demoUser, ...customers];
  const orders = [];
  for (let n = 0; n < 96; n += 1) {
    const age = Math.floor(random() * 175);
    const buyer = buyers[Math.floor(random() * buyers.length)];
    const count = 1 + Math.floor(random() * 3);
    const picked = new Set();
    while (picked.size < count) picked.add(productDocs[Math.floor(random() * productDocs.length)]);
    const items = [...picked].map((p) => ({
      product: p._id,
      title: p.title,
      image: p.images[0],
      category: categoryDocs.find((c) => c._id.equals(p.category)).name,
      price: p.price,
      quantity: random() < 0.8 ? 1 : 2,
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const inDhaka = /dhaka|gazipur|narayanganj/i.test(buyer.city || "Dhaka");
    const shippingFee = subtotal >= 3000 ? 0 : inDhaka ? 70 : 130;
    const roll = random();
    let status = "delivered";
    if (age < 4) status = roll < 0.5 ? "pending" : "confirmed";
    else if (age < 9) status = roll < 0.6 ? "shipped" : "delivered";
    else if (roll < 0.08) status = "cancelled";
    const createdAt = daysAgo(age, random);
    orders.push({
      user: buyer._id, items, subtotal, shippingFee, total: subtotal + shippingFee, status, createdAt, updatedAt: createdAt,
      shipping: {
        name: buyer.name,
        phone: `01${7 + Math.floor(random() * 3)}${String(Math.floor(random() * 1e8)).padStart(8, "0")}`,
        city: buyer.city || "Dhaka",
        address: "Delivery address on file",
      },
    });
  }
  orders.sort((a, b) => a.createdAt - b.createdAt);
  const year = new Date().getFullYear();
  orders.forEach((o, i) => { o.orderNumber = `GLW-${year}-${String(i + 1).padStart(5, "0")}`; });
  await Order.insertMany(orders);
  // Units sold come from non-cancelled orders.
  const sold = {};
  for (const o of orders) if (o.status !== "cancelled") for (const it of o.items) sold[it.product] = (sold[it.product] || 0) + it.quantity;
  await Product.bulkWrite(Object.entries(sold).map(([id, units]) => ({ updateOne: { filter: { _id: id }, update: { soldCount: units } } })));
  log(`orders: ${orders.length}`);

  // Reviews, written by customers who bought the product where possible.
  const reviews = [];
  for (const [i, product] of productDocs.entries()) {
    const slug = categoryDocs.find((c) => c._id.equals(product.category)).slug;
    const pool = REVIEWS[slug];
    const howMany = 2 + (i % 3);
    const authors = [...customers].sort(() => random() - 0.5).slice(0, howMany);
    authors.forEach((author, j) => {
      const [rating, title, comment] = pool[(i + j) % pool.length];
      reviews.push({ product: product._id, user: author._id, rating, title, comment, createdAt: daysAgo(Math.floor(random() * 120), random) });
    });
  }
  await Review.insertMany(reviews);
  await Promise.all(productDocs.map((p) => Review.syncProductRating(p._id)));
  log(`reviews: ${reviews.length}`);

  // Blog, messages, settings
  await Post.insertMany(posts.map(({ daysAgo: age, ...p }) => ({ ...p, author: admin._id, publishedAt: daysAgo(age, random) })));
  await Message.insertMany(MESSAGES.map(([name, email, subject, message], i) => ({ name, email, subject, message, status: i === 0 ? "resolved" : "new", createdAt: daysAgo(i * 3 + 1, random) })));
  await Setting.create({ key: "store" });
  log(`posts: ${posts.length}, messages: ${MESSAGES.length}`);

  return { admin, demoUser, heroImage: img("1598440947619-2c35fc9aa908") };
}

// Run directly: `npm run seed` (uses MONGODB_URI from .env).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { env } = await import("../config/env.js");
  const { connectDB } = await import("../config/db.js");
  await connectDB(env.mongoUri);
  await seedDatabase({ log: (line) => console.info(`  seeded ${line}`) });
  console.info("Seed complete.");
  await mongoose.disconnect();
}
