const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const threadSchema = new Schema({
  boardId: Schema.Types.ObjectId,
  pined: Boolean,
  closed: Boolean,
  title: String,
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
  }],
  newestAnswer: String
})
threadSchema.plugin(mongoosePaginate)

module.exports = model('Thread', threadSchema);
