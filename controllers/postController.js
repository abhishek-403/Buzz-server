const Comments = require("../models/Comments");
const Posts = require("../models/Posts");
const User = require("../models/User");
const { mapPost, mapComments } = require("../utils/Utils");
const { success, error } = require("../utils/responseWrapper");

const createPostController = async (req, res) => {
  try {
    const owner = await User.findById(req._id);
    // const io = req.app.io;
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

    // io.emit("newTweet", post);

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

    // const io = req.app.io;

    // io.emit("newTweet", post);

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

const commentOnPost = async (req, res) => {
  try {
    const { postId, message } = req.body;
    const currUserId = req._id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    const newcomment = await Comments.create({
      owner: currUserId,
      parentPost: postId,
      message,
    });
    post.comments.push(newcomment._id);

    await newcomment.save();
    await post.save();
    return res.send(success(200, "Comment posted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const myId = req._id;
    const me = await User.findById(myId);
    const post = await Posts.findById(postId);

    if (!postId || !commentId) {
      return res.send(error(403, "required fields not provided"));
    }
    const comment = await Comments.findById(commentId);
    if (comment.owner != myId) {
      return res.send(error(403, "can't delete other's comment"));
    }

    if (!post.comments.includes(commentId)) {
      return res.send(error(404, "Can't find comment"));
    }

    const idx = post.comments.indexOf(commentId);
    post.comments.splice(idx, 1);

    await post.save();
    await comment.deleteOne();
    return res.send(success(200, "deleted comment"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getAllComments = async (req, res) => {
  try {
    const { postId } = req.body;
    const myId = req._id;
    const me = await User.findById(myId);
    const allcomments = await Posts.findById(postId).populate({
      path: "comments",
      options: { sort: { createdAt: "desc" } },
      populate: {
        path: "owner",
        model: "users",
      },
    });

    if (!allcomments) {
      return res.send(error(404, "Post not found"));
    }
    const updatedData = allcomments.comments.map((d) => {
      if (me.followings.includes(d.owner._id)) {
        const newD = Object.assign(d, { isFollowingOwner: true });
        return newD;
      } else {
        const newD = Object.assign(d, { isFollowingOwner: false });
        return newD;
      }
    });

    const data = updatedData.map((item) => mapComments(item, myId));
    return res.send(success(200, { data }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletePost = async (req, res) => {
  try {
    console.log("hi");
    const { postId } = req.body;
    const myId = req._id;
    const me = await User.findById(myId);
    const targetPost = await Posts.findById(postId).populate("comments");
    if(!targetPost){
      return res.send(error(404,"Post not found"))
    }
    if (targetPost.owner != myId) {
      return res.send(error(401, "Not your post"));
    }
    const index = me.posts.indexOf(postId);
    me.posts.splice(index, 1);

    await Posts.deleteOne({_id:postId});
    console.log(targetPost);
    console.log(myId);
    await Comments.deleteMany({ parentPost: postId });
 
    await me.save();
    return res.send(success(200, { me }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  createPostController,
  createTextPostController,
  likeController,
  commentOnPost,
  getAllComments,
  deleteComment,
  deletePost,
};
