const express = require("express");
const router = express.Router();
const {
  registerPage,
  loginPage,
  homePage,
  aboutPage,
  databasePage,
} = require("../controllers/pages");

const authentication = require("../middlewares/authentication");

router.get("/", registerPage);
router.get("/login", loginPage);
router.get("/home", authentication, homePage);
router.get("/about", aboutPage);
router.get("/database", databasePage);

module.exports = router;
