const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
userSchema.plugin(mongoosePaginate)

module.exports = model('User', userSchema);
