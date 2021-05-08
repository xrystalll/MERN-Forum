const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: Date,
  onlineAt: Date,
  picture: String,
  karma: {
    type: Number,
    default: 0
  },
  role: {
    type: Number,
    default: 1
  },
  ban: {
    type: Types.ObjectId,
    ref: 'Ban'
  }
})
userSchema.plugin(mongoosePaginate)
userSchema.index({ name: 'text', displayName: 'text' })

userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch(err) {
    next(err)
  }
})

userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch(err) {
    throw err
  }
}

module.exports = model('User', userSchema);
