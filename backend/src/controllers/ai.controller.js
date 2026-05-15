const prisma = require("../config/database");
const notesService = require("../services/notes.service");
const aiService = require("../services/ai.service");
const { success, failure } = require("../utils/apiResponse");

async function loadNote(req, res) {
  const note = await notesService.getById(req.params.noteId, req.user.id);
  if (!note) {
    failure(res, "Note not found", 404);
    return null;
  }
  return note;
}

exports.summarize = async (req, res) => {
  const note = await loadNote(req, res);
  if (!note) return;
  try {
    const summary = await aiService.summarizeNote(note.content);
    await notesService.saveSummary(note.id, summary);
    return success(res, { summary });
  } catch (e) {
    return failure(res, e.message || "AI service unavailable", e.status || 503);
  }
};

exports.flashcards = async (req, res) => {
  const note = await loadNote(req, res);
  if (!note) return;
  try {
    const cards = await aiService.generateFlashcards(note.content);
    await prisma.flashcard.deleteMany({ where: { noteId: note.id } });
    await prisma.flashcard.createMany({
      data: cards.map((c) => ({ noteId: note.id, question: c.question, answer: c.answer })),
    });
    const saved = await prisma.flashcard.findMany({ where: { noteId: note.id } });
    return success(res, saved);
  } catch (e) {
    return failure(res, e.message || "AI service unavailable", e.status || 503);
  }
};

exports.quiz = async (req, res) => {
  const note = await loadNote(req, res);
  if (!note) return;
  try {
    const questions = await aiService.generateQuiz(note.content);
    return success(res, { noteId: note.id, questions });
  } catch (e) {
    return failure(res, e.message || "AI service unavailable", e.status || 503);
  }
};
