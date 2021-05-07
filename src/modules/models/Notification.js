const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new Schema({
  type: String,
  to: {
    type: Types.ObjectId,
    ref: 'User'
  },
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  pageId: Types.ObjectId,
  title: String,
  body: String,
  createdAt: Date,
  read: {
    type: Boolean,
    default: false
  }
})
notificationSchema.plugin(mongoosePaginate)

module.exports = model('Notification', notificationSchema);
