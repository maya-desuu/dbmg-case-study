const registerPage = (req, res) => {
  res.render("index", { title: "Register" });
};

const loginPage = (req, res) => {
  res.render("login", { title: "Log-in" });
};

const aboutPage = (req, res) => {
  res.render("about", { title: "About" });
};

const homePage = (req, res) => {
  res.render("home", { title: "Home" });
};

const articlePage = (req, res) => {
  res.render("article", { title: "Articles" });
};

module.exports = {
  registerPage,
  loginPage,
  homePage,
  articlePage,
  aboutPage,
};
