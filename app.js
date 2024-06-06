const express = require("express");
const app = express();
const connectDB = require("./db/connect");
equire("dotenv").config();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Get Started" });
});

app.use((req, res) => {
  res.status(404).render("404");
});
const port = 3000;

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
