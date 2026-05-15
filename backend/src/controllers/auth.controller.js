const prisma = require("../config/database");
const { hashPassword, comparePassword, signToken } = require("../services/auth.service");
const { success, failure } = require("../utils/apiResponse");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return failure(res, "Email already registered", 409);

  const user = await prisma.user.create({
    data: { name, email, password: await hashPassword(password) },
    select: { id: true, name: true, email: true },
  });
  const token = signToken(user.id);
  return success(res, { user, token }, "Registered", 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return failure(res, "Invalid credentials", 401);

  const ok = await comparePassword(password, user.password);
  if (!ok) return failure(res, "Invalid credentials", 401);

  const token = signToken(user.id);
  return success(res, {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  }, "Logged in");
};

exports.me = async (req, res) => success(res, req.user);
