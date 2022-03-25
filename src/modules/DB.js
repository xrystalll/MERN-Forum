// require("dotenv").config();
// const Mongoose = require("mongoose");

// const DB = (enviroment) => {
//   mongoDB =
//     NODE_ENV === "development" ? process.env.MONGODB : process.env.MONGODB_PROD;
//   if (mongoDB) {
//     const options = {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     };

//     if (enviroment === "test") {
//       return Mongoose.connect(process.env.MONGODB_TEST, options);
//     }
//     return Mongoose.connect(mongoDB, options);
//   } else {
//     return new Promise((resolve, reject) => {
//       reject("Set MONGODB url in env");
//     });
//   }
// };

// module.exports = DB;

require("dotenv").config();
const mongoose = require("mongoose");

const DB = async (cb) => {
  let mongoDB;
  let errMsg =
    "configure the working enviroment with correct details, 'NODE_ENV' and 'DB name' and cross-env in package.json too.";
  let dbServerErr =
    "Try to activate your DB server. If error persists, check your Enviroment in NODE_ENV and DB name";

  if (process.env.NODE_ENV === "development") {
    mongoDB = process.env.MONGODB;
  } else if (process.env.NODE_ENV === "test") {
    mongoDB = process.env.MONGODB_TEST;
  } else if (process.env.NODE_ENV === "production") {
    mongoDB = process.env.MONGODB_PROD;
  } else {
    return cb(errMsg);
  }

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  if (!mongoDB !== undefined) {
    try {
      const connection = await mongoose.connect(mongoDB, options);
      console.log(`Database connected at ${connection.connection.host}`);
      cb();
    } catch (err) {
      if (err.message.includes("connect ECONNREFUSED")) {
        console.error(dbServerErr);
      } else {
        console.error(err || errMsg);
      }
    }
  } else {
    cb(errMsg);
  }
};

module.exports = DB;
