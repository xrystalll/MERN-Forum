const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fileSchema = new Schema({
  file: String,
  type: String,
  size: String
})

const messageSchema = new Schema({
  dialogueId: Schema.Types.ObjectId,
  body: String,
  createdAt: String,
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  edited: {
    createdAt: String
  },
  file: [fileSchema],
  read: Boolean
})
messageSchema.plugin(mongoosePaginate)
messageSchema.index({ body: 'text' })

module.exports = model('Message', messageSchema);
