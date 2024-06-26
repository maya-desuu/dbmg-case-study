const mongoose = require("mongoose");
//const Grid = require("gridfs-stream");
const { StatusCodes } = require("http-status-codes");

// Initialize gridfs once db conn is open
//let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  //gfs = Grid(conn.db, mongoose.mongo);
  //gfs.collection("uploads");
  console.log("GridFS Initialized....");
});

const getAllFiles = async (req, res) => {
  try {
    const files = await gridFsBucket.find({}).toArray();
    if (!files || files.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ err: "No files exist" }); // 404
    }

    res.status(StatusCodes.OK).json(files);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message }); // 500
  }
};

const getFile = async (req, res) => {
  try {
    const files = await gridFsBucket
      .find({ filename: req.params.filename })
      .toArray();
    if (!files || files.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ err: "No file exists" }); // 404
    }

    const readstream = gridFsBucket.openDownloadStreamByName(
      req.params.filename,
    );
    readstream.on("error", (err) => {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: err.message }); // 500
    });
    readstream.pipe(res);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message }); // 500
  }
};

const handleFileUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }
    res.status(StatusCodes.CREATED).send({ file: req.file }); // 201
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) // 500
      .send({ error: error.message });
  }
};

module.exports = {
  handleFileUpload,
  getFile,
  getAllFiles,
};
