const { getUser } = require("../service/auth");

async function restrictToAuthenticated(req, res, next) {
  const userId = req.headers["authorization"];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = userId.split("Bearer ")[1];
  const user = await getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const userId = req.headers["authorization"];
  const token = userId.split("Bearer ")[1];

  const user = await getUser(token);

  req.user = user;
  next();
}

module.exports = { restrictToAuthenticated, checkAuth };
