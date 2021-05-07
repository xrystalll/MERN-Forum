const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const pathSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  title: String,
  body: String,
  position: Number,
  createdAt: Date,
  filesCount: Number
})
pathSchema.plugin(mongoosePaginate)
pathSchema.index({ name: 'text', title: 'text', body: 'text' })

module.exports = model('Folder', pathSchema);
