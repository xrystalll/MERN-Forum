const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: String
  },
  onlineAt: {
    type: String
  },
  picture: {
    type: String
  },
  role: String
})

module.exports = model('User', userSchema);
