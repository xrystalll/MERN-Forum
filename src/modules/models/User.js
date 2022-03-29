const { model, Schema, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: [
      "researcher",
      "talent",
      "founder",
      "mentor",
      "lead",
      "coop-member",
      "organization",
      "institution",
      "student",
    ],
    required: true,
  },

  active: { type: Boolean, default: false },

  experience: [
    {
      companyName: String,
      companyUrl: String,
      role: String,
      companyExperience: String,
    },
  ],

  certifications: [{ type: String }], //string in this case will be url directing to the user courses

  posts: [{ type: Types.ObjectId, ref: "Post" }],

  urlProfile: { type: String },

  blog: { type: String },

  portfolio: [{ type: String }],

  resume: { type: String },

  groups: [{ type: Types.ObjectId, ref: "Group" }],

  collaboration: [{ type: String }],

  createdAt: { type: Date, default: Date.now() },

  onlineAt: Date,

  picture: String,

  karma: {
    type: Number,
    default: 0,
  },

  // role: {
  //   type: Number,
  //   default: 1,
  // },

  ban: {
    type: Types.ObjectId,
    ref: "Ban",
  },
});
userSchema.plugin(mongoosePaginate);
userSchema.index({ name: "text", displayName: "text" });

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

module.exports = model("User", userSchema);
