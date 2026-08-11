const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const documentRoutes = require("./routes/document.routes");
const chatRoutes = require("./routes/chat.routes");
const sessionRoutes = require("./routes/session.routes");

const cookieParser = require("cookie-parser");

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
app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
