const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  if (process.env.node_ENV !== "production") {
    mongoose.set("debug", true);
  }

  const uri = process.env.ATLAS_URI;

  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log("connection error occured🤬", err);
      } else {
        console.log("connection success😍");
      }
    }
  );
};

mongoose.connection.on("error", (err) => {
  console.error("connection error occured🤬", err);
  mongoose.connection.close();
  connect();
});

mongoose.connection.on("disconnected", () => {
  console.log(
    "😢the connection has been distrupted. Try connect to it again😢"
  );
});

module.exports = connect;
