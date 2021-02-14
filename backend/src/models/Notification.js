const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new Schema({
  type: String,
  to: Schema.Types.ObjectId,
  from: {
    id: Schema.Types.ObjectId,
    username: String,
    role: String
  },
  threadId: Schema.Types.ObjectId,
  title: String,
  body: String,
  createdAt: String,
  read: Boolean
})
notificationSchema.plugin(mongoosePaginate)

module.exports = model('Notification', notificationSchema);
