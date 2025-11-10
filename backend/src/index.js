const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const path = require('path');

dotenv.config({ path: __dirname + "/../.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(require("cors")());

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
