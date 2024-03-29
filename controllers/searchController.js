const { error, success } = require("../utils/responseWrapper");
const User = require("../models/User");
const searchUsersController = async (req, res) => {
  try {
    const regexPattern = new RegExp(`^${req.body.name}`, "i");
    const query = { name: regexPattern };
    const user = await User.find(query);
    

    const data = user.map((item) => {
      let isFollowingOwner=false;
      if(item.followers.includes(req._id)){
        isFollowingOwner=true;
      }
      return {
        _id: item._id,
        avatar: item.avatar,
        email: item.email,
        name: item.name,
        username: item.username,
        bio: item.bio,
        postsCount: item.posts.length,
        followersCount: item.followers.length,
        followingsCount: item.followings.length,
        isMe:req._id===item._id,
        isFollowingOwner
      };
    });

    
    return res.send(success(200, { data }));
  } catch (e) {
    // return res.send(error(500, e.message));
    return res.send(error(500, "Error occurred"));
  }
};

module.exports = {
  searchUsersController,
};
