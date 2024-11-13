const express = require("express");
const cors = require("cors");
require("./config/connect");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const userroute = require("./routes/users");
app.use(express.json());
app.use("/users", userroute);

app.listen(3000, () => {
  console.log("server works successfully");
});
