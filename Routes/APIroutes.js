// Routes/APIRoutes.js
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.send("Server is working!");
});

module.exports = router;

