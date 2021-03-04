const { model, Schema } = require('mongoose');
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
  createdAt: String,
  onlineAt: String,
  picture: String,
  role: String,
  ip: String,
  ua: String
})
userSchema.plugin(mongoosePaginate)

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
