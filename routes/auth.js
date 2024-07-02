const express = require("express");
const router = express.Router();

const { validateUserInput, register, login } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/validate-user-input", validateUserInput);

module.exports = router;
