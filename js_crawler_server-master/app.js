const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

connectDB = require("./schemas");

const indexRouter = require("./routes");
const bookRouter = require("./routes/book");

const app = express();

connectDB();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.set("port", process.env.PORT || 4000);

app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/book", bookRouter);

app.listen(app.get("port"), () => {
  console.log("express running on ", app.get("port") + "!🤪");
});
