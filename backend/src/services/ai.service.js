const { openai, MODEL } = require("../config/openai");

const SUMMARIZE_PROMPT = `You are a study assistant. Summarize the following note for a student in 3-5 clear, simple sentences. Focus on the key concepts.

NOTE:
"""{content}"""

Return ONLY the summary text, no preamble.`;

const FLASHCARDS_PROMPT = `You are a study assistant. From the following note, generate 5 flashcards.

Return ONLY a JSON array, no markdown, no preamble. Example:
[{"question":"...","answer":"..."}]

NOTE:
"""{content}"""`;

const QUIZ_PROMPT = `You are a study assistant. From the following note, generate 5 multiple-choice questions, each with 4 options and one correct answer.

Return ONLY a JSON array, no markdown, no preamble. Example:
[{"question":"...","options":["A","B","C","D"],"answer":"A"}]

NOTE:
"""{content}"""`;

async function chat(prompt) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

function parseJsonSafe(raw) {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (_e) {
    const err = new Error("AI returned invalid JSON");
    err.status = 502;
    throw err;
  }
}

const summarizeNote = (content) => chat(SUMMARIZE_PROMPT.replace("{content}", content));

const generateFlashcards = async (content) => {
  const raw = await chat(FLASHCARDS_PROMPT.replace("{content}", content));
  const parsed = parseJsonSafe(raw);
  if (!Array.isArray(parsed)) throw Object.assign(new Error("Expected array"), { status: 502 });
  return parsed.filter((c) => c && c.question && c.answer);
};

const generateQuiz = async (content) => {
  const raw = await chat(QUIZ_PROMPT.replace("{content}", content));
  const parsed = parseJsonSafe(raw);
  if (!Array.isArray(parsed)) throw Object.assign(new Error("Expected array"), { status: 502 });
  return parsed.filter(
    (q) => q && q.question && Array.isArray(q.options) && q.options.length === 4 && q.answer
  );
};

module.exports = { summarizeNote, generateFlashcards, generateQuiz };
