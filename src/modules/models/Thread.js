const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const attachSchema = new Schema({
  file: String,
  thumb: String,
  type: String,
  size: String
})

const threadSchema = new Schema({
  boardId: Types.ObjectId,
  pined: Boolean,
  closed: Boolean,
  title: String,
  body: String,
  createdAt: Date,
  author: {
    type: Types.ObjectId,
    ref: 'User'
  },
  edited: {
    createdAt: Date
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  attach: [attachSchema],
  answersCount: Number,
  newestAnswer: Date
})
threadSchema.plugin(mongoosePaginate)
threadSchema.index({ title: 'text', body: 'text' })

module.exports = model('Thread', threadSchema);
