const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reportSchema = new Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  threadId: Types.ObjectId,
  postId: Types.ObjectId,
  title: String,
  body: String,
  createdAt: Date,
  read: {
    type: Boolean,
    default: false
  }
})
reportSchema.plugin(mongoosePaginate)

module.exports = model('Report', reportSchema);
