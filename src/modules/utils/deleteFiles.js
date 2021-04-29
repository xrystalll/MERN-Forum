const fs = require('fs');

module.exports = (files, callback) => {
  let i = files.length
  files.map(filepath => {
    fs.unlink(filepath, (err) => {
      i--
      if (err) {
        return callback(err)
      } else if (i <= 0) {
        callback(null)
      }
    })
  })
}
