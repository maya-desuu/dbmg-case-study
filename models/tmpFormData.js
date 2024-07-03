const mongoose = require("mongoose");

const TmpFormData = new mongoose.Schema(
  {
    data: Object,
    createdAt: { type: Date, expires: "1h", default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("tmpFormormData", TmpFormData);
