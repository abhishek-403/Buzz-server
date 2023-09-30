const Posts = require("../models/Posts");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { error, success } = require("../utils/responseWrapper");
const { mapPost, myPostsMap } = require("../utils/Utils");

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
    console.log("pic",req.file.path);
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
    let data = await Posts.find().populate("owner");

    let newData = data.map((item) => mapPost(item, req._id));
    return res.send(success(200, { newData }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPostsController = async (req, res) => {
  try {
    const user = await User.findById(req._id).populate("posts");

    const posts = user.posts.map((item) => myPostsMap(item, user));

    return res.send(success(200, { posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  getMyProfile,
  getMyFeedController,
  getMyPostsController,
  editMyProfile,
};
