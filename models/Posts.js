const mongoose = require('mongoose');

const postSchema=mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,        
        ref:'users',
        required:true

    },
    
    image:{
        publicId:String,
        url:String
    },
    message:{
        type:String,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comments'
        }

    ]
},

{
    timestamps:true

}
)

module.exports= mongoose.model('posts',postSchema)