const { model, Schema } = require('mongoose');

const boardSchema = new Schema({
  title: String,
  position: Number,
  createdAt: String
})

module.exports = model('Board', boardSchema);
