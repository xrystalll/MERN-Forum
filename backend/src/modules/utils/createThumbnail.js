const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic)
ffmpeg.setFfprobePath(ffprobeStatic.path)

module.exports = (file, dest, thumbFilename) => {
  return new Promise((resolve, reject) => {
    ffmpeg(file)
      .screenshots({
        folder: path.join(__dirname, '..', '..', '..', 'public', dest, 'thumbnails'),
        filename: thumbFilename,
        timestamps: ['1%'],
        size: '480x?'
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        resolve(thumbFilename)
      })
  })
}