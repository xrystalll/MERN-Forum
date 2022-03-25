require("dotenv").config();
const DB = require("./modules/DB");

require("./app"); //app.js

console.new = (err) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  /* this means we are now in production using an else block here, use a logging tool like winston, e.t.c*/
};

const port = process.env.PORT || 8000;
DB((errMsg) => {
  if (errMsg) {
    console.error(errMsg);
  }
  // hence either connect the server or leave as it is for just a DB connection for testing purposes
});
