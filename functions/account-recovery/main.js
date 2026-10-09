import { Account } from "appwrite";
import { Client, Users, Databases, Query } from "node-appwrite";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const QUESTIONS = [
  "What was the name of your first school?",
  "What is your mother's maiden name?",
  "What was your first pet's name?",
  "In what town were you born?",
];

const normalize = (s) =>
  String(s || "")
    .trim()
    .toLowerCase();

const strongPassword = (p) =>
  typeof p === "string" && p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p);

function hashAnswer(answer) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(normalize(answer), salt, 32).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function checkAnswer(answer, stored) {
  if (!stored) return false;
  if (stored.startsWith("scrypt$")) {
    const [, salt, hash] = stored.split("$");
    const attempt = scryptSync(normalize(answer), salt, 32);
    const expected = Buffer.from(hash, "hex");
    return (
      attempt.length === expected.length && timingSafeEqual(attempt, expected)
    );
  }
  // old accounts that still have a plain-text answer
  return normalize(answer) === normalize(stored);
}

export default async ({ req, res, log, error }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers["x-appwrite-key"]);

    const users = new Account(client);
    const databases = new Databases(client);
    const databaseId = process.env.DATABASE_ID;
    const tableId = process.env.USERS_TABLE_ID;

    let body = {};
    try {
      body = req.bodyJson || {};
    } catch {
      body = {};
    }
    const { action } = body;
    const email = normalize(body.email);

    const findUser = async (mail) => {
      const list = await users.list({
        queries: [Query.equal("email", mail), Query.limit(1)],
      });
      return list.users[0] || null;
    };

    const getProfile = (userId) =>
      databases.getDocument({
        databaseId,
        collectionId: tableId,
        documentId: userId,
      });

    // 1) Return the security question for an email
    if (action === "question") {
      const user = email ? await findUser(email) : null;
      if (user) {
        try {
          const profile = await getProfile(user.$id);
          if (profile.securityQuestion) {
            return res.json({ ok: true, question: profile.securityQuestion });
          }
        } catch {}
      }
      // Unknown emails get a fake question, so nobody can tell
      // which emails are registered
      const index =
        [...email].reduce((n, c) => n + c.charCodeAt(0), 0) % QUESTIONS.length;
      return res.json({ ok: true, question: QUESTIONS[index] });
    }

    // 2) Check the answer and set the new password
    if (action === "reset") {
      const { answer, newPassword } = body;
      if (!strongPassword(newPassword)) {
        return res.json({
          ok: false,
          message:
            "Password needs 8+ characters, a capital letter and a number.",
        });
      }
      const user = email ? await findUser(email) : null;
      let profile = null;
      if (user) {
        try {
          profile = await getProfile(user.$id);
        } catch {}
      }
      if (!user || !profile || !checkAnswer(answer, profile.securityAnswer)) {
        return res.json({
          ok: false,
          message: "Email or answer is incorrect.",
        });
      }
      await users.updatePassword({ userId: user.$id, password: newPassword });
      await users.deleteSessions({ userId: user.$id }); // sign out other devices
      return res.json({ ok: true, message: "Password changed." });
    }

    // 3) Save a security question + hashed answer (logged-in users only)
    if (action === "setSecurity") {
      const userId = req.headers["x-appwrite-user-id"];
      if (!userId)
        return res.json({ ok: false, message: "Not logged in." }, 401);
      const { question, answer } = body;
      if (!question || normalize(answer).length < 3) {
        return res.json(
          { ok: false, message: "Question and answer are required." },
          400,
        );
      }
      await databases.updateDocument({
        databaseId,
        collectionId: tableId,
        documentId: userId,
        data: {
          securityQuestion: question,
          securityAnswer: hashAnswer(answer),
        },
      });
      return res.json({ ok: true });
    }

    return res.json({ ok: false, message: "Unknown action." }, 400);
  } catch (err) {
    error(String(err.message || err));
    return res.json(
      { ok: false, message: "Something went wrong. Try again." },
      500,
    );
  }
};
