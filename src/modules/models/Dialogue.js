const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const dialogueSchema = new Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: Types.ObjectId,
    ref: 'Message'
  },
  updatedAt: Date
})
dialogueSchema.plugin(mongoosePaginate)

module.exports = model('Dialogue', dialogueSchema);
