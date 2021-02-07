const { model, Schema } = require('mongoose');

const answerSchema = new Schema({
  boardId: String,
  threadId: String,
  body: String,
  createdAt: String,
  author: [{
    id: Schema.Types.ObjectId,
    username: String
  }],
  edited: [{
    createdAt: String
  }],
  likes: [{
    username: String,
    createdAt: String
  }],
  attach: [{
    file: String,
    type: String
  }]
})

module.exports = model('Answer', answerSchema);
