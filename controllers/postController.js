const Posts = require("../models/Posts");
const User = require("../models/User");
const { mapPost } = require("../utils/Utils");
const { success, error } = require("../utils/responseWrapper");

const createPostController = async (req, res) => {
  try {
    const owner = await User.findById(req._id);
    let imageUrl;
    if (req.file.path) {
      imageUrl = req.file.path;
    }

    const post = await Posts.create({
      message: req.body.message,
      images: [
        {
          url: imageUrl,
        },
      ],
      owner,
    });
    owner.posts.push(post._id);
    await owner.save();

    return res.send(success(201, "Post added"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const createTextPostController = async (req, res) => {
  try {
    const { message } = req.body;
    const owner = await User.findById(req._id);

    const post = await Posts.create({
      message,
      owner,
    });
    owner.posts.push(post._id);
    await owner.save();

    return res.send(success(200, "Post created"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const likeController = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserId = req._id;
    const post = await Posts.findById(postId).populate("owner");
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.likes.includes(currUserId)) {
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currUserId);
    }

    await post.save();
    return res.send(success(200, { post: mapPost(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  createPostController,
  createTextPostController,
  likeController,
};
