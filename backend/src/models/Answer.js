const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
answerSchema.plugin(mongoosePaginate)

module.exports = model('Answer', answerSchema);
