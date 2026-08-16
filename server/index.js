const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const documentRoutes = require("./routes/document.routes");
const chatRoutes = require("./routes/chat.routes");
const sessionRoutes = require("./routes/session.routes");
const conversationRoutes = require("./routes/conversation.routes");
const usageRoutes = require("./routes/usage.routes");

const cookieParser = require("cookie-parser");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/document", documentRoutes);
app.use("/session", sessionRoutes);
app.use("/conversation", conversationRoutes);
app.use("/usage", usageRoutes);
app.use("/chat", chatRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err?.message === "Only PDF files are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
});

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
