const { findFileByName, createReadStream } = require("../admin/storage");
const { StatusCodes } = require("http-status-codes");

const handleFileUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }
    res.status(StatusCodes.CREATED).send({ file: req.file }); // 201
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message }); // 500
  }
};

const getFile = async (req, res) => {
  try {
    const file = await findFileByName(req.params.filename);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ err: "No file exists" }); // 404
    }

    const readstream = createReadStream(file.filename);
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

module.exports = {
  handleFileUpload,
  getFile,
};
