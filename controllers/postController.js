const Posts = require("../model/Posts");
const User = require("../model/User");
const { mapPost } = require("../utils/Utils");
const { success, error } = require("../utils/responseWrapper");


const createPostController = async (req, res) => {
    try {
      const {message, img } = req.body;
      const owner = req._id;
      if(!caption || !img){
        return res.send(error(400,"Caption and img required"))
      }
  
      const user = await User.findById(req._id);
  
      const cloudImg = await cloudinary.uploader.upload(img, {
        folder: 'Postpics'
      });
  
      const post = await Posts.create({
        caption,
        owner,
        image:{
          url: cloudImg.secure_url,
          publicId: cloudImg.public_id
        }
      });
      user.posts.push(post._id);
      await user.save();
      return res.send(success(201, {post}));
    } catch (e) {
      return res.send(error(500, e.message));
    }
  };
  

module.exports={
    createPostController
}