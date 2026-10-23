import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/helpers.js";

function authResponse(res, user, status = 200) {
  res.status(status).json({ success: true, token: signToken(user), user });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    throw new ApiError(409, "An account with this email already exists.", { email: "This email is already registered" });
  }
  const user = await User.create({ name, email, password, lastLoginAt: new Date() });
  authResponse(res, user, 201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Incorrect email or password.");
  }
  if (user.status === "blocked") throw ApiError.forbidden("This account has been blocked. Contact support.");
  user.lastLoginAt = new Date();
  await user.save();
  authResponse(res, user);
}

export async function me(req, res) {
  res.json({ success: true, user: req.user });
}
