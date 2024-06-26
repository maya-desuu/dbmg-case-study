const { gfs } = require("../db/gridFS");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
//const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads",
      // other options you might want to include:
      // bucketName: "uploads",
      mimetype: file.mimetype,
    };
    console.log(file);
  },
});

//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    //return new Promise((resolve, reject) => {
//    //  //crypto.randomBytes(16, (err, buf) => {
//    //    if (err) {
//    //      return reject(err);
//    //    }
//    //const filename = buf.toString("hex") + path.extname(file.originalname);
//    //const fileInfo = {
//    mimetype: m
//      filename: file.originalname,
//      bucketName: "uploads",
//    //};
//    //resolve(fileInfo);
//    //});
//    //});
//  },
//});

const upload = multer({ storage });
const fileUpload = upload.array("files", 100); // Allow up to 100 files

//const folderStorage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    return new Promise((resolve, reject) => {
//      crypto.randomBytes(16, (err, buf) => {
//        if (err) {
//          console.error("Error generating random bytes:", err);
//          return reject(err);
//        }
//        const filename = buf.toString("hex") + path.extname(file.originalname);
//        const fileInfo = {
//          filename: filename,
//          bucketName: "uploads",
//        };
//        resolve(fileInfo);
//      });
//    });
//  },
//});

const folderUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // check if the data being uploaded is a folder
    if (file.webkitRelativePath.includes("/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Please upload a folder containing the files, not individual files.",
        ),
        false,
      );
    }
  },
}).array("folder", 100); // Allow up to 100 files from the folder

const findFileByName = async (filename) => {
  return await gfs.files.findOne({ filename });
};

const createReadStream = (filename) => {
  return gfs.createReadStream(filename);
};

module.exports = {
  fileUpload,
  folderUpload,
  findFileByName,
  createReadStream,
};
