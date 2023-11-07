var ta = require("time-ago");
var dayjs = require("dayjs");

function getCustomRelativeTimestamp(creationTime) {
  const timestamp = dayjs(creationTime);
  const now = dayjs();

  const diff = now.diff(timestamp);

  if (diff >= 365 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (365 * 24 * 60 * 60 * 1000))}y`;
  } else if (diff >= 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))}m`;
  } else if (diff >= 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (7 * 24 * 60 * 60 * 1000))}w`;
  } else if (diff >= 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}h`;
  } else if (diff >= 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}min`;
  } else if (diff >= 1000) {
    return `${Math.floor(diff / 1000)}sec`;
  } else {
    return "Just now";
  }
}
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
      email: post.owner.email,
      postsCount: post.owner.posts.length,
      followersCount: post.owner.followers.length,
      followingsCount: post.owner.followings.length,
      bio: post.owner.bio,
    },
    likesCount: post.likes.length,
    commentsCount: 0,
    viewsCount: 0,
    sharesCount: 0,
    retweetsCount: 0,
    isLiked: post.likes.includes(userId),
    isFollowingOwner: post.isFollowingOwner,
    isMyPost:userId==post.owner._id,

    timeAgo: getCustomRelativeTimestamp(post.createdAt),
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

    timeAgo: getCustomRelativeTimestamp(post.createdAt),
  };
};
const mapUsersPosts = (post, user, _id) => {
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
    // isFollowed: post.followers.includes(_id),

    timeAgo: getCustomRelativeTimestamp(post.createdAt),
  };
};

module.exports = {
  mapPost,
  mapMyPosts,
  mapUsersPosts,
};
