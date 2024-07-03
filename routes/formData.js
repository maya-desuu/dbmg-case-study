const express = require("express");
const router = express.Router();

const { getFormData, storeFormData } = require("../controllers/formData.js");
const authFormDataToken = require("../middlewares/authFormDataToken.js");

router.route("/").get(authFormDataToken, getFormData).post(storeFormData);

module.exports = router;
