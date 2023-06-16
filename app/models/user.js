const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (password) {
  if (this.password === password) {
    return password;
  } else {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
