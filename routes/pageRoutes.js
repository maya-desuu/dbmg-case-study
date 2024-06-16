const express = require("express");
const router = express.Router();
const {
  registerPage,
  loginPage,
  aboutPage,
  databasePage,
} = require("../controllers/pageController");

router.get("/", registerPage);
router.get("/login", loginPage);
router.get("/about", aboutPage);
router.get("/database", databasePage);

module.exports = router;
