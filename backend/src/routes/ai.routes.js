const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const rateLimiter = require("../middleware/rateLimiter");
const wrap = require("../utils/asyncWrapper");
const ctrl = require("../controllers/ai.controller");

router.use(auth, rateLimiter);

router.post("/summarize/:noteId", wrap(ctrl.summarize));
router.post("/flashcards/:noteId", wrap(ctrl.flashcards));
router.post("/quiz/:noteId", wrap(ctrl.quiz));

module.exports = router;
