const express = require("express");
const router = express.Router();
const URL = require("../models/url");

router.use(express.static("public"));

router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allUrls = await URL.find({ userId: req.user._id }).lean();
  res.render("home", { urls: allUrls });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
