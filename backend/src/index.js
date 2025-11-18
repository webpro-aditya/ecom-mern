const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: __dirname + "/../.env" });
connectDB();

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_LAN_URL,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://192.168.29.89:5050",
].filter(Boolean);

const corsConfig = {
  origin: (origin, callback) => {
    const isLocalOrLan = origin && /^https?:\/\/(localhost|127\.0\.0\.1|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})(:\d{2,5})?$/.test(origin);
    if (!origin || allowedOrigins.includes(origin) || isLocalOrLan) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// CSRF protection: double-submit cookie strategy
const crypto = require("crypto");
function generateCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}

app.get("/api/csrf-token", (req, res) => {
  const token = generateCsrfToken();
  res.cookie("csrfToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });
  res.json({ csrfToken: token });
});

function verifyCsrf(req, res, next) {
  const exempt = req.method === "POST" && (req.path === "/api/auth/login" || req.path === "/api/auth/register");
  if (exempt) return next();
  const method = req.method;
  const requires = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (!requires) return next();
  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = req.cookies && req.cookies.csrfToken;
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next();
}

app.use(verifyCsrf);

app.use(
  "/uploads",
  (req, res, next) => {
    if (!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(req.path)) return res.status(404).end();
    next();
  },
  express.static(path.join(__dirname, "../public/uploads"), {
    maxAge: process.env.NODE_ENV === "production" ? "30d" : "0",
    etag: true,
    setHeaders: (res) => {
      res.setHeader(
        "Cache-Control",
        process.env.NODE_ENV === "production"
          ? "public, max-age=2592000, immutable"
          : "public, max-age=0"
      );
    },
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));

const PORT_BASE = parseInt(process.env.PORT || "5000", 10);
function startServer(port) {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));
  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      const next = port + 1;
      console.error(`Port ${port} in use, trying ${next}`);
      startServer(next);
    } else {
      console.error("Server error:", err);
    }
  });
}
startServer(PORT_BASE);
