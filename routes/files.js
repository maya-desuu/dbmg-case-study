const express = require("express");
const router = express.Router();

const authUser = require("../middlewares/authUser");

const upload = require("../services/uploadStorage");
const {
  handleFileUpload,
  getFile,
  getAllFiles,
} = require("../controllers/files");

const authAdmin = require("../middlewares/authAdmin");

router.get("/", getAllFiles);
router.get("/:id", authUser, getFile);
router.post("/upload/file", authAdmin, upload, handleFileUpload);
router.post("/upload/folder", authAdmin, upload, handleFileUpload);

module.exports = router;
