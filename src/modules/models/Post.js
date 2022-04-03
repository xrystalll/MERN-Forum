const { Schema, model, Types } = require("mongoose");

const PostSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Post", PostSchema);
