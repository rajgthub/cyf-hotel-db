const express = require("express");
const router = express.Router();

const class2 = require("./class2");
const class3 = require("./class3");
router.use("/", class2);
router.use("/hw", class3);

module.exports = router;
