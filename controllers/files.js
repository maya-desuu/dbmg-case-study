const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// initialize gridfs once db conn is open
const conn = mongoose.connection;
conn.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
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
  const { id: fileId } = req.params;
  console.log("get file params: ", req.params);

  try {
    // convert fileId to ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);

    const files = await gridFsBucket.find({ _id: objectId }).toArray();
    if (!files.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ err: "File not found" });
    }

    // create read stream && pipe it to response
    const downloadStream = gridFsBucket.openDownloadStream(objectId);
    downloadStream.on("error", (error) => {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const handleFileUpload = (req, res) => {
  console.log();
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }
    res.status(StatusCodes.CREATED).send({ file: req.files }); // 201
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
