const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new Schema({
  type: String,
  to: Schema.Types.ObjectId,
  from: Schema.Types.ObjectId,
  threadId: Schema.Types.ObjectId,
  title: String,
  body: String,
  createdAt: String,
  read: Boolean
})
notificationSchema.plugin(mongoosePaginate)

module.exports = model('Notification', notificationSchema);
