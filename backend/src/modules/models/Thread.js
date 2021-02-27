const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const threadSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  pined: Boolean,
  closed: Boolean,
  title: String,
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
  }],
  answersCount: String,
  newestAnswer: String
})
threadSchema.plugin(mongoosePaginate)

module.exports = model('Thread', threadSchema);
