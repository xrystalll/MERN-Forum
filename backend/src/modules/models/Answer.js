const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const answerSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  threadId: Schema.Types.ObjectId,
  answeredTo: String,
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
  attach: [{
    file: String,
    type: String
  }]
})
answerSchema.plugin(mongoosePaginate)

module.exports = model('Answer', answerSchema);
