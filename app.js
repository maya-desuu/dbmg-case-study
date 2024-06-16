const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./db/connect");

// templating engine and static files
app.set("view engine", "ejs");
app.use(express.static("public"));

// router
const pageRoutes = require("./routes/pageRoutes.js");

// error handler
const notFoundMiddleWare = require("./middlewares/not-found.js");
const errorHandlerMiddeWare = require("./middlewares/error-handler.js");

// routes
app.use("/", pageRoutes);

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
