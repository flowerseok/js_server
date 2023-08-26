const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new Schema({
  rank: {
    type: Number,
    require: true,
  },
  bookname: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  publisher: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("Book", bookSchema);
