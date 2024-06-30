const express = require("express");
const router = express.Router();

const upload = require("../configs/uploadStorage");
const {
  handleFileUpload,
  getFile,
  getAllFiles,
} = require("../controllers/files");

router.get("/", getAllFiles);
router.get("/:id", getFile);
router.post("/upload/file", upload, handleFileUpload);
router.post("/upload/folder", upload, handleFileUpload);

module.exports = router;
