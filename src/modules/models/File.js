const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fileObjectSchema = new Schema({
  url: String,
  thumb: String,
  type: String,
  size: String
})

const fileSchema = new Schema({
  folderId: Types.ObjectId,
  title: String,
  body: String,
  createdAt: Date,
  author: {
    type: Types.ObjectId,
    ref: 'User'
  },
  file: fileObjectSchema,
  likes: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  downloads: Number,
  commentsCount: Number,
  moderated: {
    type: Boolean,
    default: false
  }
})
fileSchema.plugin(mongoosePaginate)
fileSchema.index({ title: 'text', body: 'text' })

module.exports = model('File', fileSchema);
