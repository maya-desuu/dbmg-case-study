const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
//const crypto = require("crypto");
const path = require("path");

//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    return {
//      filename: file.originalname,
//      bucketName: "uploads",
//      mimetype: file.mimetype,
//    };
//  },
//});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    // Get the folder path from the request, or use a default
    const folderPath = req.body.folderPath || "default_folder";

    return {
      filename: path.join(folderPath, file.originalname),
      bucketName: "uploads",
      mimetype: file.mimetype,
    };
  },
});

// filtering cause pdfjs only supports pdf obv
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only pdf files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter }).array("files", 200); // allow upto 200 files on upload

// WILL USE IF THE NEED TO HASH THE FILENAME ARISES
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

module.exports = upload;
