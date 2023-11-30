const mongoose = require("mongoose");

const commetnsSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    parentPost:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
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
   
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comments", commetnsSchema);
