const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const banSchema = new Schema({
  userId: Schema.Types.ObjectId,
  reason: String,
  body: String,
  createdAt: String,
  expiresAt: String
})
banSchema.plugin(mongoosePaginate)

module.exports = model('Ban', banSchema);
