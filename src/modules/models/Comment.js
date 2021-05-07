const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new Schema({
  fileId: Types.ObjectId,
  commentedTo: Types.ObjectId,
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
  }]
})
commentSchema.plugin(mongoosePaginate)
commentSchema.index({ body: 'text' })

module.exports = model('Comment', commentSchema);
