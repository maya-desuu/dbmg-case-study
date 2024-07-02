const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.get("/", (req, res) => {
  try {
    const tempKey = crypto.randomBytes(32).toString("hex");
    // Store this key temporarily on the server, associated with the user's session
    req.session.tempKey = tempKey;
    res.status(200).json({ tempKey });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
