const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const banSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  admin: {
    type: Types.ObjectId,
    ref: 'User'
  },
  reason: String,
  body: String,
  createdAt: Date,
  expiresAt: Date
})
banSchema.plugin(mongoosePaginate)

module.exports = model('Ban', banSchema);
