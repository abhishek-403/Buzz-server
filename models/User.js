const mongoose = require('mongoose');


const userSchema = mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            lowercase:true,            
            unique:true,
            
        },
        name:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true,      
            lowercase:true,
            unique:true,
        },
        bio:{
            type:String,
            require:true
        },
        password:{
            type:String,
            required:true,
            select:false
            
        },
        avatar:{
            publicId:String,
            url:String,
            default:""

        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            }
        ],
        followings:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            }
        ],
        posts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'post'

            }
        ]
    },

    {
        timestamps:true

    }
)


module.exports = mongoose.model('users',userSchema);
