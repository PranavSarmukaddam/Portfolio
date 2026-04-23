const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Load environment variables from .env file
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const portfolioFile = path.join(dataDir, "portfolio.json");
const messagesFile = path.join(dataDir, "messages.json");
const messagesDbFile = path.join(dataDir, "messages.db");

const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || EMAIL_USER;
const EMAIL_ENABLED = Boolean(EMAIL_USER && EMAIL_PASSWORD && NOTIFICATION_EMAIL);
const ADMIN_DASHBOARD_TOKEN = process.env.ADMIN_DASHBOARD_TOKEN || "";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;
const MESSAGE_COOLDOWN_MS = 30 * 1000;

let db;

const transporter = EMAIL_ENABLED
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    })
  : null;

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.log("Email service could not be verified:", error.message);
    } else {
      console.log("Email service ready.");
    }
  });
} else {
  console.log("Email notifications disabled. Set EMAIL_USER, EMAIL_PASSWORD, and NOTIFICATION_EMAIL.");
}

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.static(__dirname));

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many submissions from this network. Please try again in a few minutes."
  }
});

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(req) {
  return String(req.ip || "").replace(/^::ffff:/, "");
}

function readAdminToken(req) {
  const authHeader = String(req.get("authorization") || "");
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return String(req.get("x-admin-token") || "").trim();
}

function requireAdminToken(req, res, next) {
  if (!ADMIN_DASHBOARD_TOKEN) {
    return res.status(503).json({ error: "Admin dashboard is not configured." });
  }

  if (readAdminToken(req) !== ADMIN_DASHBOARD_TOKEN) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  return next();
}

async function readJson(filePath, fallbackValue) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallbackValue;
  }
}

async function initializeDatabase() {
  await fs.mkdir(dataDir, { recursive: true });

  const database = await open({
    filename: messagesDbFile,
    driver: sqlite3.Database
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      path TEXT NOT NULL,
      referrer TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    );
  `);

  const countRow = await database.get("SELECT COUNT(*) AS count FROM messages");
  if (countRow?.count === 0) {
    const existingMessages = await readJson(messagesFile, []);
    for (const row of existingMessages) {
      await database.run(
        `INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)`,
        sanitizeText(row.name),
        sanitizeText(row.email),
        sanitizeText(row.message),
        row.createdAt || new Date().toISOString()
      );
    }
  }

  return database;
}

app.get("/api/health", (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/api/portfolio", async (_, res) => {
  const portfolio = await readJson(portfolioFile, {});
  res.json(portfolio);
});

app.post("/api/track", async (req, res) => {
  const type = sanitizeText(req.body.type).slice(0, 50);
  const label = sanitizeText(req.body.label).slice(0, 120);
  const eventPath = sanitizeText(req.body.path).slice(0, 200);

  if (!type || !label || !eventPath) {
    return res.status(400).json({ error: "Invalid tracking payload." });
  }

  const createdAt = new Date().toISOString();
  const ipAddress = getClientIp(req);
  const userAgent = sanitizeText(req.get("user-agent")).slice(0, 300);
  const referrer = sanitizeText(req.get("referer") || req.get("referrer")).slice(0, 300);

  await db.run(
    `INSERT INTO events (type, label, path, referrer, ip_address, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    type,
    label,
    eventPath,
    referrer,
    ipAddress,
    userAgent,
    createdAt
  );

  return res.status(201).json({ success: true });
});

app.post("/api/messages", messageLimiter, async (req, res) => {
  const honeypot = sanitizeText(req.body.website);
  if (honeypot) {
    return res.status(400).json({ error: "Invalid submission." });
  }

  const name = sanitizeText(req.body.name);
  const email = sanitizeText(req.body.email);
  const message = sanitizeText(req.body.message);
  const ipAddress = getClientIp(req);
  const userAgent = sanitizeText(req.get("user-agent")).slice(0, 300);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({ error: "One or more fields are too long." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  const recentMessage = await db.get(
    `SELECT created_at FROM messages WHERE ip_address = ? ORDER BY id DESC LIMIT 1`,
    ipAddress
  );

  if (recentMessage?.created_at) {
    const elapsedMs = Date.now() - new Date(recentMessage.created_at).getTime();
    if (elapsedMs < MESSAGE_COOLDOWN_MS) {
      return res
        .status(429)
        .json({ error: "Please wait a few seconds before sending another message." });
    }
  }

  const createdAt = new Date().toISOString();
  await db.run(
    `INSERT INTO messages (name, email, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    name,
    email,
    message,
    ipAddress,
    userAgent,
    createdAt
  );

  if (transporter) {
    try {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: NOTIFICATION_EMAIL,
        subject: `New Portfolio Message from ${name}`,
        html: `
          <h2>New Message from Your Portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          <hr>
          <p><small>Received on ${new Date().toLocaleString()}</small></p>
        `
      });
    } catch (error) {
      console.log("Email sending failed:", error.message);
    }
  }

  return res.status(201).json({ success: true, message: "Message received." });
});

app.get("/api/admin/stats", requireAdminToken, async (_, res) => {
  const [messageCount, eventCount, clickCount, recentMessages, topClicks] = await Promise.all([
    db.get("SELECT COUNT(*) AS count FROM messages"),
    db.get("SELECT COUNT(*) AS count FROM events"),
    db.get("SELECT COUNT(*) AS count FROM events WHERE type = 'click'"),
    db.all(
      `SELECT id, name, email, message, created_at
       FROM messages
       ORDER BY id DESC
       LIMIT 10`
    ),
    db.all(
      `SELECT label, path, COUNT(*) AS count
       FROM events
       WHERE type = 'click'
       GROUP BY label, path
       ORDER BY count DESC, label ASC
       LIMIT 10`
    )
  ]);

  return res.json({
    messages: messageCount.count,
    events: eventCount.count,
    clicks: clickCount.count,
    recentMessages,
    topClicks
  });
});

app.get("/api/admin/messages", requireAdminToken, async (_, res) => {
  const rows = await db.all(
    `SELECT id, name, email, message, ip_address AS ipAddress, user_agent AS userAgent, created_at AS createdAt
     FROM messages
     ORDER BY id DESC
     LIMIT 100`
  );

  return res.json({ messages: rows });
});

app.get("/api/admin/events", requireAdminToken, async (_, res) => {
  const rows = await db.all(
    `SELECT id, type, label, path, referrer, ip_address AS ipAddress, user_agent AS userAgent, created_at AS createdAt
     FROM events
     ORDER BY id DESC
     LIMIT 100`
  );

  return res.json({ events: rows });
});

app.get(["/admin", "/admin/"], (_, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function startServer() {
  db = await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
