const express = require("express");
const { port } = require("./config");
const app = express();
const cors = require("cors");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const notFound = require("./middleware/notFound");
const connectDB = require("./db/index");
const userRoute = require("./router/user/userRoutes");
const chatRoute = require("./router/chat/chatRoutes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to this server");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Example app listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});

app.use(globalErrorHandler);
app.use(notFound);
