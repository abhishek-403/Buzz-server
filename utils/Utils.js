var ta = require("time-ago");
var dayjs = require("dayjs");

function getCustomRelativeTimestamp(creationTime) {
  const timestamp = dayjs(creationTime);
  const now = dayjs();

  const diff = now.diff(timestamp);

  if (diff >= 365 * 24 * 60 * 60 * 1000) {
    const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    return `${years}y`;
  } else if (diff >= 30 * 24 * 60 * 60 * 1000) {
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    return `${months}mon`;
  } else if (diff >= 7 * 24 * 60 * 60 * 1000) {
    const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    return `${weeks}w`;
  } else if (diff >= 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d`;
  } else if (diff >= 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h`;
  } else if (diff >= 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}min`;
  } else if (diff >= 1000) {
    const seconds = Math.floor(diff / 1000);
    return `${seconds}sec`;
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
    isMyPost:true,
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
    isMyPost:false,
    timeAgo: getCustomRelativeTimestamp(post.createdAt),
  };
};

module.exports = {
  mapPost,
  mapMyPosts,
  mapUsersPosts,
};
