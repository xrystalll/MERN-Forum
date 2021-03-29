const Mongoose = require('mongoose');

const DB = () => {
  if (process.env.MONGODB) {
    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    }

    return Mongoose.connect(process.env.MONGODB, options)
  } else {
    return new Promise((resolve, reject) => {
      reject('Set MONGODB url in env')
    })
  }
}

module.exports = DB;
