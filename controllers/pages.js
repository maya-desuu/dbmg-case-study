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

const databasePage = (req, res) => {
  res.render("database", { title: "Research Papers" });
};

module.exports = {
  registerPage,
  loginPage,
  homePage,
  databasePage,
  aboutPage,
};
