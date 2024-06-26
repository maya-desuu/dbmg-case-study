const express = require("express");
const router = express.Router();

const { handleFileUpload, getFile } = require("../controllers/files");
const { fileUpload, folderUpload } = require("../admin/storage");

router.post("/upload/file", fileUpload, handleFileUpload);
router.post("/upload/folder", folderUpload, handleFileUpload);
router.get("/:filename", getFile);

module.exports = router;
