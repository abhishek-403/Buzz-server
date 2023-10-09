var ta = require("time-ago");

const mapPost = (post, userId) => {
  return {
    _id: post.id,
    message: post.message,
    images: post.images,
    owner: {
      _id: post.owner._id,
      name: post.owner.name,
      username: post.owner.username,
      avatar: post.owner.avatar,
    },
    likesCount: post.likes.length,
    commentsCount: 0,
    viewsCount: 0,
    sharesCount: 0,
    retweetsCount: 0,
    isLiked: post.likes.includes(userId),
    timeAgo: ta.ago(post.createdAt),
  };
};
const mapMyPosts = (post, user) => {
  return {
    _id: post.id,
    message: post.message,
    images: post.images,
    owner: {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
    likesCount: post.likes.length,
    commentsCount: 0,
    viewsCount: 0,
    sharesCount: 0,
    retweetsCount: 0,
    isLiked: post.likes.includes(user._id),
    timeAgo: ta.ago(post.createdAt),
  };
};
const mapUsersPosts = (post, user,_id) => {
  return {
    _id: post.id,
    message: post.message,
    images: post.images,
    owner: {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
    likesCount: post.likes.length,
    commentsCount: 0,
    viewsCount: 0,
    sharesCount: 0,
    retweetsCount: 0,
    isLiked: post.likes.includes(_id),
    timeAgo: ta.ago(post.createdAt),
  };
};

module.exports = {
  mapPost,
  mapMyPosts,
  mapUsersPosts
};
