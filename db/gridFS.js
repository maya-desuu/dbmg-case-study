//const mongoose = require("mongoose");
//const Grid = require("gridfs-stream");
//
//let gfs;
//let gridFsBucket;
//
//const conn = mongoose.connection;
//conn.once("open", async () => {
//  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//    bucketName: "uploads", // GridFS bucket name
//  });
//  gfs = await Grid(conn.db, mongoose.mongo);
//  gfs.collection("uploads");
//  console.log("GridFS Initialized....");
//});
//
//module.exports = { gfs, gridFsBucket };
