const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');

dotenv.config({ path: __dirname + "/../.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(require("cors")());

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
