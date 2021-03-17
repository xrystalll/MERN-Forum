const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const pathSchema = new Schema({
  name: String,
  title: String,
  body: String,
  position: Number,
  createdAt: String,
  filesCount: Number
})
pathSchema.plugin(mongoosePaginate)
pathSchema.index({ name: 'text', title: 'text', body: 'text' })

module.exports = model('Folder', pathSchema);
