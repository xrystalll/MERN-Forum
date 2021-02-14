const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const answerSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  threadId: Schema.Types.ObjectId,
  answeredTo: String,
  body: String,
  createdAt: String,
  author: {
    id: Schema.Types.ObjectId,
    username: String,
    role: String

  },
  edited: {
    createdAt: String
  },
  likes: [{
    id: Schema.Types.ObjectId,
    username: String,
    picture: String,
    createdAt: String
  }],
  attach: [{
    file: String,
    type: String
  }]
})
answerSchema.plugin(mongoosePaginate)

module.exports = model('Answer', answerSchema);
