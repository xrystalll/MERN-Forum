const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const answerSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  threadId: Schema.Types.ObjectId,
  answeredTo: String,
  body: String,
  createdAt: String,
  author: Schema.Types.ObjectId,
  edited: {
    createdAt: String
  },
  likes: [{
    userId: Schema.Types.ObjectId
  }],
  attach: [{
    file: String,
    type: String
  }]
})
answerSchema.plugin(mongoosePaginate)

module.exports = model('Answer', answerSchema);
