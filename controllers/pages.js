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

const accountPage = (req, res) => {
  res.render("account", { title: "Account" });
};

module.exports = {
  registerPage,
  loginPage,
  homePage,
  accountPage,
  tmpPage,
  //articlePage,
  aboutPage,
};
