const Hive = require("../models/Hive");
const Posts = require("../models/Posts");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");

const createHiveController = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    if (!name) {
      return res.send(error(403, "Hive name required"));
    }
    const me = await User.findById(req._id);
    const hive = await Hive.create({
      name,
      description,
      visibility,
      creator: { _id: req._id, avatar: me.avatar },
    });
    hive.members.push(req._id);
    hive.admins.push(req._id);

    me.hives.push(hive._id);
    await me.save();
    await hive.save();

    return res.send(success(200, "Hive created"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyHives = async (req, res) => {
  try {
    const me = await User.findById(req._id).populate("hives");

    return res.send(success(200, { hives: me.hives }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getOneHiveInfo = async (req, res) => {
  try {
    const { hiveId } = req.body;
    if (!hiveId) {
      return res.send(error(404, "Hive id required"));
    }

    const hive = await Hive.findById(hiveId)
      .populate("members")
      .populate("posts");

    const members = hive.members.map((item) => {
      let isFollowingOwner = false;
      if (item.followers.includes(req._id)) {
        isFollowingOwner = true;
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
        isMe: req._id == item._id,
        isFollowingOwner,
      };
    });
    return res.send(success(200, { members }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const addMember = async (req, res) => {
  try {
    const { memberId, hiveId } = req.body;
    const myId = req._id;
    if (!memberId || !hiveId) {
      return res.send(error(404, "ids required"));
    }
    
    const hive = await Hive.findById(hiveId);
    
    if (!hive.admins.includes(myId)) {
      return res.send(error(403, "Only admins can add members"));
    }
    if (hive.members.includes(memberId)) {
     
      return res.send(error(403, "user already in hive"));
    }
    const member = await User.findById(memberId);

    member.joinedHives.push(hiveId);
    hive.members.push(memberId);
    member.save();
    hive.save();
    return res.send(success(200, "User added to hive"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const removeMember = async (req, res) => {
  try {
    const { memberId, hiveId } = req.body;
    const myId = req._id;
    if (!memberId || !hiveId) {
      return res.send(error(404, "ids required"));
    }

    const hive = await Hive.findById(hiveId);
    const member = await User.findById(memberId);
    if (!hive.admins.includes(myId)) {
      return res.send(error(403, "Only admins can remove members"));
    }
    if (!hive.members.includes(memberId)) {
      return res.send(error(403, "user not in hive"));
    }

    if (hive.members.includes(memberId)) {
      const idx = hive.members.indexOf(memberId);
      const idx2 = member.joinedHives.indexOf(hiveId);
      hive.members.splice(idx, 1);
      member.joinedHives.splice(idx2, 1);
    } else {
      return res.send(error(403, "user not in hive"));
    }

    member.save();
    hive.save();
    return res.send(success(200, "User removed from hive"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const addPost = async (req, res) => {
  try {
    const { postId, hiveId } = req.body;
    const myId = req._id;
    if (!postId || !hiveId) {
      return res.send(error(404, "ids required"));
    }

    const hive = await Hive.findById(hiveId);
    if (!hive.members.includes(myId)) {
      return res.send(error(403, "Only members can add posts"));
    }
    if (hive.posts.includes(postId)) {
      return res.send(error(403, "post already in hive"));
    }
    const post = await Posts.findById(postId);
    post.joinedHives.push(hiveId);
    hive.posts.push(postId);
    post.save();
    hive.save();
    return res.send(success(200, "Post added to hive"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const removePost = async (req, res) => {
  try {
    const { postId, hiveId } = req.body;
    const myId = req._id;
    if (!postId || !hiveId) {
      return res.send(error(404, "ids required"));
    }

    const hive = await Hive.findById(hiveId);
    if (!hive.members.includes(myId)) {
      return res.send(error(403, "Only members can remove posts"));
    }
    if (!hive.posts.includes(postId)) {
      return res.send(error(403, "post not in hive"));
    }
    const post = await Posts.findById(postId);

    if (hive.posts.includes(postId)) {
      const idx = hive.posts.indexOf(postId);
      const idx2 = post.joinedHives.indexOf(hiveId);
      hive.posts.splice(idx, 1);
      post.joinedHives.splice(idx2, 1);
    } else {
      return res.send(error(403, "post not in hive"));
    }

    post.save();
    hive.save();
    return res.send(success(200, "Post removed from hive"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const searchUserToAdd = async (req, res) => {
  try {
    const regexPattern = new RegExp(`^${req.body.name}`, "i");
    const query = { name: regexPattern };
    const user = await User.find(query);

    const data = user.map((item) => ({
      _id: item._id,
      avatar: item.avatar,
      email: item.email,
      name: item.name,
      username: item.username,
    }));
    return res.send(success(200, { data }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createHiveController,
  getMyHives,
  getOneHiveInfo,
  addMember,
  removeMember,
  addPost,
  removePost,
  searchUserToAdd,
};
