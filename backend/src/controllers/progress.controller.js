const prisma = require("../config/database");
const { success, failure } = require("../utils/apiResponse");

exports.save = async (req, res) => {
  const { noteId, score, total } = req.body;
  if (!noteId || typeof score !== "number" || typeof total !== "number") {
    return failure(res, "noteId, score, total required");
  }
  const note = await prisma.note.findFirst({ where: { id: noteId, userId: req.user.id } });
  if (!note) return failure(res, "Note not found", 404);

  const attempt = await prisma.quizAttempt.create({
    data: { noteId, score, total, userId: req.user.id },
  });
  return success(res, attempt, "Saved", 201);
};

exports.list = async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "asc" },
    include: { note: { select: { id: true, title: true } } },
  });
  return success(res, attempts);
};
