const express = require("express");
const {
  handleGenerateShorturl,
  handleGetAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateShorturl);

router.get("/:shortId/analytics", handleGetAnalytics);
module.exports = router;
