const Mongoose = require('mongoose');

const DB = () => {
  if (process.env.MONGODB) {
    return Mongoose.connect(process.env.MONGODB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  }
}

module.exports = DB;
