const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const authHistorySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  loginAt: Date,
  ip: String,
  ua: String
})
authHistorySchema.plugin(mongoosePaginate)
authHistorySchema.index({ ip: 'text' })

module.exports = model('AuthHistory', authHistorySchema);
