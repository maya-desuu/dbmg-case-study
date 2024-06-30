//const multer = require("multer");
//const { GridFsStorage } = require("multer-gridfs-storage");
//const { ObjectId } = require("mongodb");
//const elasticClient = require("../admin/elasticSearch"); // Import the Elasticsearch client
//
//// Initialize GridFS storage
//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    return {
//      filename: file.originalname,
//      bucketName: "uploads",
//      metadata: { mimetype: file.mimetype }, // Save mimetype as metadata
//    };
//  },
//});
//
//// Set up multer for file upload
//const upload = multer({ storage }).array("files", 100); // Change "file" to your field name
//
//// Function to handle file upload and indexing
//const uploadAndIndexFile = async (req, res) => {
//  try {
//    // Upload file to MongoDB GridFS
//    upload(req, res, async (err) => {
//      if (err) {
//        return res.status(400).json({ error: err.message });
//      }
//
//      // File saved in GridFS, now index in Elasticsearch
//      const savedFileId = req.file.id.toString();
//      const savedFileName = req.file.filename;
//      const uploadDate = new Date();
//
//      // Index file metadata in Elasticsearch
//      await elasticClient.index({
//        index: "files",
//        id: savedFileId,
//        body: {
//          filename: savedFileName,
//          uploadDate: uploadDate,
//          // Add any other metadata you want to index
//        },
//      });
//
//      // Respond with success message
//      res
//        .status(200)
//        .json({ message: "File uploaded and indexed successfully" });
//    });
//  } catch (error) {
//    console.error("Error uploading and indexing file:", error);
//    res.status(500).json({ error: "Failed to upload and index file" });
//  }
//};
//
//module.exports = { uploadAndIndexFile };
