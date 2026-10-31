const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const urlRoutes = require("./routes/url");
const staticRoutes = require("./routes/staticRouter");
const userRoutes = require("./routes/user");
const { restrictToAuthenticated, checkAuth } = require("./middlewares/auth");

const connectDB = require("./connect");
const URL = require("./models/url");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/url", restrictToAuthenticated, urlRoutes);
app.use("/", checkAuth, staticRoutes);
app.use("/api/user", checkAuth, userRoutes);

app.get("/url/:shortId", async (req, res) => {
  try {
    const url = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { returnDocument: "after" },
    );

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    const target = /^https?:\/\//i.test(url.redirectUrl)
      ? url.redirectUrl
      : `https://${url.redirectUrl}`;
    res.redirect(target);
  } catch (error) {
    console.error("Error occurred while fetching URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
