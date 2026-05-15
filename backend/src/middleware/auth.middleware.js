const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Missing token" });
    }
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });
    if (!user) return res.status(401).json({ success: false, error: "Invalid token" });
    req.user = user;
    next();
  } catch (_e) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};
