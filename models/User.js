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
      default:"https://res.cloudinary.com/dyqzaxyqw/image/upload/f_auto,q_auto/v1/avatars/profileicondefault_ersiah"
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
