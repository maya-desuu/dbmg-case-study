const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();

const connectDB = require("./db/connect");

// security packages
const cors = require("cors");
//const helmet = require("helmet");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("./public"));
//app.use(helmet())
const corsOptions = {
  origin: "https://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// router
const pagesRouter = require("./routes/pages.js");
const authRouter = require("./routes/auth.js");

// error handler
const notFoundMiddleWare = require("./middlewares/not-found.js");
const errorHandlerMiddeWare = require("./middlewares/error-handler.js");

// routes
app.use("/", pagesRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddeWare);

const port = 3000;

// connect db
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server running on port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
