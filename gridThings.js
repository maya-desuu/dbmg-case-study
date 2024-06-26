//1. Database Connection(db / connect.js)
//
//javascript
//
//const mongoose = require('mongoose');
//
//const connectDB = (uri) => {
//  return mongoose.connect(uri, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//  });
//};
//
//module.exports = connectDB;
//
//2. File Model(models / fileModel.js)
//
//This file will initialize GridFS and export the instance:
//
//javascript
//
//const mongoose = require('mongoose');
//const Grid = require('gridfs-stream');
//
//let gfs;
//
//const initGridFS = () => {
//  const conn = mongoose.connection;
//  conn.once('open', () => {
//    gfs = Grid(conn.db, mongoose.mongo);
//    gfs.collection('uploads');
//  });
//};
//
//module.exports = { gfs, initGridFS };
//
//3. File Service(services / fileService.js)
//
//Update the file service to use Mongoose and Multer:
//
//javascript
//
//const multer = require('multer');
//const { gfs } = require('../models/fileModel');
//const crypto = require('crypto');
//const path = require('path');
//const GridFsStorage = require('multer-gridfs-storage');
//
//// Setup storage engine
//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    return new Promise((resolve, reject) => {
//      crypto.randomBytes(16, (err, buf) => {
//        if (err) {
//          return reject(err);
//        }
//        const filename = buf.toString('hex') + path.extname(file.originalname);
//        const fileInfo = {
//          filename: filename,
//          bucketName: 'uploads'
//        };
//        resolve(fileInfo);
//      });
//    });
//  }
//});
//
//const upload = multer({ storage });
//
//const uploadFile = upload.single('file');
//
//const findFileByName = async (filename) => {
//  return await gfs.files.findOne({ filename });
//};
//
//const createReadStream = (filename) => {
//  return gfs.createReadStream(filename);
//};
//
//module.exports = {
//  uploadFile,
//  findFileByName,
//  createReadStream
//};
//
//4. File Controller(controllers / fileController.js)
//
//Update the controller to use the service methods:
//
//javascript
//
//const { uploadFile, findFileByName, createReadStream } = require('../services/fileService');
//
//const handleFileUpload = (req, res) => {
//  res.status(201).send({ file: req.file });
//};
//
//const getFile = async (req, res) => {
//  const file = await findFileByName(req.params.filename);
//  if (!file || file.length === 0) {
//    return res.status(404).json({ err: 'No file exists' });
//  }
//
//  const readstream = createReadStream(file.filename);
//  readstream.pipe(res);
//};
//
//module.exports = {
//  uploadFile,
//  handleFileUpload,
//  getFile
//};
//
//5. File Routes(routes / fileRoutes.js)
//
//Define the routes for file operations:
//
//  javascript
//
//const express = require('express');
//const router = express.Router();
//const { uploadFile, handleFileUpload, getFile } = require('../controllers/fileController');
//
//router.post('/upload', uploadFile, handleFileUpload);
//router.get('/file/:filename', getFile);
//
//module.exports = router;
//
//6. Application Initialization(app.js)
//
//Ensure the application initializes the database connection and GridFS properly:
//
//javascript
//
//const express = require("express");
//const app = express();
//require("express-async-errors");
//require("dotenv").config();
//const morgan = require("morgan");
//const connectDB = require("./db/connect");
//const { initGridFS } = require('./models/fileModel');
//
//// security packages
//// const cors = require("cors");
//// const helmet = require("helmet");
//
//// template engine, parse json objects, and static files
//app.set("view engine", "ejs");
//app.use(express.json());
//app.use(express.static("./public"));
//
//app.use(morgan("dev"));
//// app.use(cookieParser());
//// app.use(cors());
//// app.use(helmet());
//
//// router
//const pagesRouter = require("./routes/pages.js");
//const authRouter = require("./routes/auth.js");
//const fileRouter = require("./routes/fileRoutes.js");
//
//// error handler
//const notFoundMiddleWare = require("./middlewares/not-found.js");
//const errorHandlerMiddeWare = require("./middlewares/error-handler.js");
//
//// routes
//app.use("/", pagesRouter);
//app.use("/api/v1/auth", authRouter);
//app.use("/api/v1/files", fileRouter);
//
//app.use(notFoundMiddleWare);
//app.use(errorHandlerMiddeWare);
//
//const port = 3000;
//
//// connect db
//const start = async () => {
//  try {
//    await connectDB(process.env.MONGO_URI);
//    initGridFS();
//    app.listen(port, () => {
//      console.log(`Server running on port ${port}....`);
//    });
//  } catch (error) {
//    console.log(error);
//  }
//};
//
//start();
