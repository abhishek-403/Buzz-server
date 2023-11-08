const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    images: [
      {
        
        url:String
      }
    ],
    message: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comments'
        }

    ],
    views:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }

    ],
    shares:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }

    ],
    retweets:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }

    ],
    joinedHives:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hives'
    }
    ]
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("posts", postSchema);
