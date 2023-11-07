const Posts = require("../models/Posts");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { error, success } = require("../utils/responseWrapper");
const { mapPost, mapMyPosts, mapUsersPosts } = require("../utils/Utils");

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const editMyProfile = async (req, res) => {
  try {
    const { username, name, bio } = req.body;
    const user = await User.findById(req._id);

    if (username) {
      user.username = username;
    }
    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    console.log("pic", req.file.path);
    if (req.file.path) {
      user.avatar = req.file.path;
    }

    await user.save();

    return res.send(success(200, "Profile Updated"));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};
const getMyFeedController = async (req, res) => {
  try {
    // let data = await Posts.find().sort({ _id: -1 }).populate("owner");
    const me = await User.findById(req._id);
    const { page, pageSize } = req.body;
    const skip = (page - 1) * pageSize;
    const data = await Posts.find()
      .populate("owner")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(pageSize));

    const updatedData = data.map((d) => {
      if (me.followings.includes(d.owner._id)) {
        const newD = Object.assign(d, { isFollowingOwner: true });
        return newD;
      } else {
        const newD = Object.assign(d, { isFollowingOwner: false });
        return newD;
      }
    });
    let newData = updatedData.map((item) => mapPost(item, req._id));

    return res.send(success(200, { newData }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPostsController = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    const user = await User.findById(req._id).populate({
      path: "posts",
      options: {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
    });

    // const user = await User.findById(req._id).populate("posts");
    // const posts = user.posts.map((item) => mapMyPosts(item, user));

    const posts = user.posts.map((item) => mapMyPosts(item, user));

    return res.send(success(200, { posts: posts.reverse() }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUsersPostsController = async (req, res) => {
  try {
    // const _id= req._id;
    // const {userId}= req.body;
    // const user = await User.findById(userId).populate('posts');
    // const posts = user.posts.map((item)=>mapUsersPosts(item,user,_id))

    const { page, pageSize, userId } = req.body;
    const user = await User.findById(userId).populate({
      path: "posts",
      options: {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
    });
    const posts = user.posts.map((item) => mapMyPosts(item, user));

    return res.send(success(200, { posts: posts.reverse() }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const followController = async (req, res) => {
  try {
    const currUserId = req._id;
    const { userIdToFollow } = req.body;
    if (!userIdToFollow) {
      return res.send(error(403, "User to follow required"));
    }
    if (currUserId === userIdToFollow) {
      return res.send(error(403, "Cannot follow ourselves"));
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currUser = await User.findById(currUserId);

    if (currUser.followings.includes(userIdToFollow)) {
      const index = currUser.followings.indexOf(userIdToFollow);
      const index2 = userToFollow.followers.indexOf(currUserId);

      currUser.followings.splice(index, 1);
      userToFollow.followers.splice(index2, 1);
      await userToFollow.save();
      await currUser.save();
      return res.send(success(200, "Unfollowed!"));
    } else {
      userToFollow.followers.push(currUserId);
      currUser.followings.push(userIdToFollow);

      await userToFollow.save();
      await currUser.save();
      return res.send(success(200, "Followed!"));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  getMyProfile,
  getMyFeedController,
  getMyPostsController,
  editMyProfile,
  getUsersPostsController,
  followController,
};
