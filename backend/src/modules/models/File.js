const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fileObjectSchema = new Schema({
  url: String,
  type: String,
  size: String
})

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  body: String,
  createdAt: String
})

const fileSchema = new Schema({
  folderId: Schema.Types.ObjectId,
  title: String,
  body: String,
  createdAt: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: fileObjectSchema,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downloads: Number,
  comments: [commentSchema],
  moderated: Boolean
})
fileSchema.plugin(mongoosePaginate)
fileSchema.index({ title: 'text', body: 'text' })

module.exports = model('File', fileSchema);
