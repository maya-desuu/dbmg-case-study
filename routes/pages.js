const express = require("express");
const router = express.Router();
const {
  registerPage,
  loginPage,
  homePage,
  aboutPage,
  accountPage,
  articlePage,
} = require("../controllers/pages");

const authentication = require("../middlewares/authentication");

router.get("/", registerPage);
router.get("/login", loginPage);
router.get("/home", homePage);
router.get("/article", articlePage);
router.get("/about", aboutPage);
router.get("/account", accountPage);

module.exports = router;
