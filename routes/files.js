const express = require("express");
const router = express.Router();

const upload = require("../admin/uploadStorage");
const {
  handleFileUpload,
  getFile,
  getAllFiles,
} = require("../controllers/files");

router.get("/", getAllFiles);
router.get("/:filename", getFile);
router.post("/upload/file", upload, handleFileUpload);
router.post("/upload/folder", upload, handleFileUpload);

module.exports = router;
