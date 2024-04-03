const express = require("express");
const router = express.Router();
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");

router.get("/", (req, res) => {
  res.send(`Welcome To SnehMilan Portal With Version V1`);
});

router.use("/v1", AuthRoute, UserRoute);

module.exports = router;
