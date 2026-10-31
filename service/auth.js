const jwt = require("jsonwebtoken");
const secret = "divya$123";

function setUser(user) {
  const payload = { _id: user._id, email: user.email, username: user.username };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    // malformed, expired, or signed with a different secret
    return null;
  }
}

module.exports = { setUser, getUser };
