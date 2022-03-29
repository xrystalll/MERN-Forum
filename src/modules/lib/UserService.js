const User = require("../models/User.js");

const checkEmailUsername = async (email, username) => {
  const errors = {};
  const userNameDoesExist = await User.findOne({ username: username });
  if (userNameDoesExist) {
    errors["username"] = `sorry username ${username} is already taken`;
  }

  const emailDoesExist = await User.findOne({ email: email });
  if (emailDoesExist) {
    errors["email"] = `sorry, email ${email} is already in use`;
  }

  return errors;
};

module.exports = {
  checkEmailUsername,
};
