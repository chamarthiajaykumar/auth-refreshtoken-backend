const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 4000;

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((err) => console.log(err));

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}`);
});
