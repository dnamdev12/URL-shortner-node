const moongose = require("mongoose");

const userSchema = new moongose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const User = moongose.model("User", userSchema);

module.exports = User;
