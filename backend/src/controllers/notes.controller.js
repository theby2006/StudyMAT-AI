const notesService = require("../services/notes.service");
const { success, failure } = require("../utils/apiResponse");

exports.list = async (req, res) => success(res, await notesService.listForUser(req.user.id));

exports.get = async (req, res) => {
  const note = await notesService.getById(req.params.id, req.user.id);
  if (!note) return failure(res, "Note not found", 404);
  return success(res, note);
};

exports.create = async (req, res) =>
  success(res, await notesService.create(req.user.id, req.body), "Created", 201);

exports.update = async (req, res) => {
  const note = await notesService.update(req.params.id, req.user.id, req.body);
  if (!note) return failure(res, "Note not found", 404);
  return success(res, note, "Updated");
};

exports.remove = async (req, res) => {
  const note = await notesService.remove(req.params.id, req.user.id);
  if (!note) return failure(res, "Note not found", 404);
  return success(res, { id: note.id }, "Deleted");
};
