const express = require("express");
const version = require("../package.json").version;
const router = express.Router();

router.get("/version", (req, res, next) => {
  res.status(200);
  res.send(version);
});

module.exports = router;
