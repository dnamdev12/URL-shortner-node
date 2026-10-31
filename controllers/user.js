const crypto = require("crypto");
const User = require("../models/user");
const { setUser } = require("../service/auth");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const attempt = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(attempt, Buffer.from(hash, "hex"));
}

async function handleSignup(req, res) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).render("signup", {
      error: "Username, password, and email are required",
      username,
      email,
    });
  }

  try {
    await User.create({
      username,
      email,
      password: hashPassword(password),
    });

    return res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).render("signup", {
        error: `That ${field} is already taken`,
        username,
        email,
      });
    }
    console.error("Error occurred during signup:", error);
    res.status(500).render("signup", {
      error: "Something went wrong, please try again",
      username,
      email,
    });
  }
}

async function handleLogin(req, res) {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).render("login", {
      error: "Password and email are required",
      email,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).render("login", {
        error: "Invalid email or password",
        email,
      });
    }

    const token = setUser(user);
    // res.cookie("sessionId", token, { httpOnly: true, maxAge: 3600000 });
    return res.json({ token });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).render("login", {
      error: "Something went wrong, please try again",
      email,
    });
  }
}

module.exports = { handleSignup, handleLogin };
