const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/aviationDB")
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
