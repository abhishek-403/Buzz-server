const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select:false,
    },
    bio: {
      type: String,
    },
    avatar: {
      type:String,
      default:'https://res-console.cloudinary.com/dyqzaxyqw/thumbnails/v1/image/upload/v1693913386/YXZhdGFycy9wcm9maWxlaWNvbmRlZmF1bHRfZXJzaWFo/grid_landscape'
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
