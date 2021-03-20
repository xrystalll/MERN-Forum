const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new Schema({
  fileId: Schema.Types.ObjectId,
  commentedTo: Schema.Types.ObjectId,
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
  }]
})
commentSchema.plugin(mongoosePaginate)
commentSchema.index({ body: 'text' })

module.exports = model('Comment', commentSchema);
