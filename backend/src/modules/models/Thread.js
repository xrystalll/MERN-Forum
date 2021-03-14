const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const attachSchema = new Schema({
  file: String,
  type: String,
  size: String
})

const threadSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  pined: Boolean,
  closed: Boolean,
  title: String,
  body: String,
  createdAt: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  edited: {
    createdAt: String
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  attach: [attachSchema],
  answersCount: Number,
  newestAnswer: String
})
threadSchema.plugin(mongoosePaginate)
threadSchema.index({ title: 'text', body: 'text' })

module.exports = model('Thread', threadSchema);
