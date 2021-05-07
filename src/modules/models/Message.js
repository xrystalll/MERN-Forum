const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fileSchema = new Schema({
  file: String,
  thumb: String,
  type: String,
  size: String
})

const messageSchema = new Schema({
  dialogueId: Types.ObjectId,
  body: String,
  createdAt: Date,
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Types.ObjectId,
    ref: 'User'
  },
  edited: {
    createdAt: Date
  },
  file: [fileSchema],
  read: {
    type: Boolean,
    default: false
  }
})
messageSchema.plugin(mongoosePaginate)
messageSchema.index({ body: 'text' })

module.exports = model('Message', messageSchema);
