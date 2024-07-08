//const gfs = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    //const { formData: metadata } = JSON.parse(req.body.metadata || "{}");
//    //console.log(metadata);
//    return {
//      filename: file.originalname,
//      bucketName: "uploads",
//      metadata: file.metadata,
//    };
//  },
//});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    console.log("Request body:", req.body);
    console.log("File:", file);

    // Consider all fields in req.body as metadata, except 'files'
    const metadata = { ...req.body };
    delete metadata.files;

    console.log("Metadata:", metadata);

    return {
      filename: file.originalname,
      bucketName: "uploads",
      metadata: metadata,
    };
  },
});

//filtering cause this api only supports pdf
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only pdf files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter }).array("files", 200); // allow upto 200 files on upload

module.exports = upload;
