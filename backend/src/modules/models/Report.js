const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reportSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  threadId: Schema.Types.ObjectId,
  title: String,
  body: String,
  createdAt: String,
  read: Boolean
})
reportSchema.plugin(mongoosePaginate)

module.exports = model('Report', reportSchema);
