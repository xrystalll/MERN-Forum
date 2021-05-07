const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const attachSchema = new Schema({
  file: String,
  thumb: String,
  type: String,
  size: String
})

const answerSchema = new Schema({
  boardId: Types.ObjectId,
  threadId: Types.ObjectId,
  answeredTo: Types.ObjectId,
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
  attach: [attachSchema]
})
answerSchema.plugin(mongoosePaginate)
answerSchema.index({ body: 'text' })

module.exports = model('Answer', answerSchema);
