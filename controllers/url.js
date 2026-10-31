const { nanoid } = require("nanoid");

const URL = require("../models/url");

async function handleGenerateShorturl(req, res) {
  const body = req.body;
  if (!body.redirectUrl || body.redirectUrl.trim() === "") {
    return res.status(400).json({ error: "redirectUrl is required" });
  }
  const shortId = nanoid(8);

  await URL.create({
    shortId,
    redirectUrl: body.redirectUrl,
    visitHistory: [],
    createdBy: req.user._id,
  });

  res.status(201).json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  try {
    const url = await URL.findOne({ shortId });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json({
      totolClicks: url.visitHistory.length,
      visitHistory: url.visitHistory,
    });
  } catch (error) {
    console.error("Error occurred while fetching analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { handleGenerateShorturl, handleGetAnalytics };
