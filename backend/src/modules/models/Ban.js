const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const banSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: String,
  body: String,
  createdAt: String,
  expiresAt: String
})
banSchema.plugin(mongoosePaginate)

module.exports = model('Ban', banSchema);
