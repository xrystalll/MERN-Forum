const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const boardSchema = new Schema({
  title: String,
  body: String,
  position: Number,
  createdAt: String
})
boardSchema.plugin(mongoosePaginate)

module.exports = model('Board', boardSchema);
