const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const dialogueSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
})
dialogueSchema.plugin(mongoosePaginate)

module.exports = model('Dialogue', dialogueSchema);
