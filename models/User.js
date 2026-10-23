import bcrypt from "bcrypt";
import mongoose from "mongoose";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 60 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    avatar: { type: String, default: "" },
    phone: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, maxlength: 280, default: "" },
    skinType: {
      type: String,
      enum: ["", "oily", "dry", "combination", "normal", "sensitive"],
      default: "",
    },
    preferences: {
      newsletter: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
    },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);
