const { getFile } = require("./files");

const registerPage = (req, res) => {
  res.render("index", { title: "Register" });
};

const loginPage = (req, res) => {
  res.render("login", { title: "Log-in" });
};

const aboutPage = (req, res) => {
  res.render("about", { title: "About" });
};

const articlePage = (req, res) => {
  res.render("article", { title: "Articles" });
};

const homePage = (req, res) => {
  res.render("home", { title: "Home" });
};

const accountPage = (req, res) => {
  res.render("account", { title: "Account" });
};

const viewArticle = async (req, res) => {
  res.render("view-article", { title: "View Article" });
};

module.exports = {
  registerPage,
  loginPage,
  homePage,
  accountPage,
  articlePage,
  viewArticle,
  aboutPage,
};
