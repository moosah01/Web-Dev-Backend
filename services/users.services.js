const User = require("../models/users.models.js");
const Posts = require("../models/posts.models.js");
const Challenges = require("../models/challenges.models.js");
const Followers = require("../models/followers.models.js");
const Following = require("../models/following.models.js");
const FollowRequests = require("../models/followRequests.models.js");
const MyPosts = require("../models/myposts.models.js");
const MyChallenges = require("../models/mychallenges.models.js");

const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.js");

async function login({ userName, password }, callback) {
  //find the first user with the given fullname
  const user = await User.findOne({ userName });

  //if user exists
  if (user != null) {
    //if the passwords match
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(userName);
      //first parameter is for error
      //since the is the user exists + password match condition
      //you wont return any error and pass parameter as null
      return callback(null, { ...user.toJSON(), token });
    }
    //even if passwor is wrong u will say
    //both password and fullname are invalid
    else {
      return callback({
        message: "Invalid fullname AND/OR password!",
      });
    }
  }
  //if user is not found
  else {
    return callback({
      message: "User does not exist",
    });
  }
}

async function register(params, callback) {
  //if the user did not type in any fullname

  if (!params.fullName || !params.userName) {
    console.log("fullname or username is undefined");
    return callback({ message: "Full Name AND User Name is required" });
  }

  if (!params.password) {
    console.log("Password is undefined");
    return callback({ message: "Password is required" });
  }

  if (!params.email) {
    console.log("Email is undefined");
    return callback({ message: "Email is required" });
  }

  const user = new User(params);
  user
    .save()
    .then((responseUser) => {
      console.log("User Saved");
      const follower = new Followers(params);
      follower
        .save()
        .then((responseFollower) => {
          console.log("Followers document created");
          const following = new Following(params);
          following
            .save()
            .then((responseFollowing) => {
              console.log("Following document created");
              const followRequests = new FollowRequests(params);
              followRequests
                .save()
                .then((responseFollowReqs) => {
                  console.log("Follow Requests document created");

                  const myPosts = new MyPosts(params);
                  myPosts.save().then((responseMyPosts) => {
                    console.log("My Posts document created");
                    const myChallenges = new MyChallenges(params);
                    myChallenges.save().then((responseMyChallenges) => {
                      console.log("My Challenges document created");
                      return callback(null, responseUser);
                    });
                  });
                })
                .catch((error) => {
                  return callback(error);
                });
            })
            .catch((error) => {
              return callback(error);
            });
        })
        .catch((error) => {
          return callback(error);
        });
    })
    .catch((error) => {
      return callback(error);
    });
}

async function updatePassword(
  { userName, newPassword, oldPassword },
  callback
) {
  if (!oldPassword) {
    console.log("Old password is required");
    return callback({ message: "Current password is required" });
  }

  if (!newPassword) {
    console.log("new password is required");
    return callback({ message: "New password is required" });
  }

  if (!userName) {
    console.log("userName is required");
    return callback({ message: "userName is required" });
  }

  const user = await User.findOne({ userName });

  if (user != null) {
    if (bcrypt.compareSync(oldPassword, user.password)) {
      user.password = newPassword;
    } else {
      return callback({
        message: "The password entered is incorrect",
      });
    }
  } else {
    //user is nulll
    return callback({
      message: "User does not exist",
    });
  }

  //update password
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function updatePrivateStatus({ userName }, callback) {
  if (!userName) {
    console.log("userName is required");
    return callback({ message: "userName is required" });
  }

  const user = await User.findOne({ userName });

  if (user != null) {
    user.private = !user.private;
  } else {
    return callback({
      message: "User does not exist",
    });
  }
  //update private status
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function updateProfilePicture({ userName, newProfileUrl }, callback) {
  if (!userName) {
    console.log("userName is required");
    return callback({ message: "userName is required" });
  }

  if (!newProfileUrl) {
    console.log("profile url is required");
    return callback({ message: "profile url is required" });
  }

  const user = await User.findOne({ userName });

  if (user != null) {
    user.userProfilePicture = newProfileUrl;
  } else {
    return callback({
      message: "User does not exist",
    });
  }
  //update private status
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function updateProfileBio({ userName, newProfileBio }, callback) {
  if (!userName) {
    console.log("userName is required");
    return callback({ message: "userName is required" });
  }

  if (!newProfileBio) {
    console.log("Bio needs to be entered");
    return callback({ message: "Add a Bio bro" });
  }

  const user = await User.findOne({ userName });

  if (user != null) {
    user.profileBio = newProfileBio;
  } else {
    return callback({
      message: "User does not exist",
    });
  }
  //update private status
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function sendFollowRequest({ userName, sendRequestTo }, callback) {
  if (!userName || !sendRequestTo) {
    console.log("userName & sendRequestTo Missing");
    return callback({ message: "userName & sendRequestTo is required" });
  }

  console.log("I am at step 1");
  const user = await User.findOne({ userName: userName }); //sending req
  const user2 = await User.findOne({ userName: sendRequestTo }); //this user is being sent request to

  if (user != null && user2 != null) {
    console.log("I am here step 2");
    const isAlreadyFollowing = await Following.findOne({
      userName: userName,
      following: sendRequestTo,
    });

    const hasAlreadySentRequest = await FollowRequests.findOne({
      userName: sendRequestTo,
      requests: userName,
    });

    if (isAlreadyFollowing == null && hasAlreadySentRequest == null) {
      console.log("I am here step 3");
      await FollowRequests.findOneAndUpdate(
        {
          //first is filter on the basis of
          userName: sendRequestTo,
        },
        {
          //use $push if you dont want unique check before pushing
          $addToSet: {
            requests: userName,
          },
        }
      );
      return callback(null, "Success");
    } else {
      console.log("I am here step 4");
      if (isAlreadyFollowing) {
        return callback({
          message: "You are already following this user",
        });
      }
      if (hasAlreadySentRequest) {
        return callback({
          message: "You have already sent this user a friend request",
        });
      }
    }
  } else {
    if (!user) {
      return callback({
        message: "User 1 does not exist.",
      });
    } else if (!user2) {
      return callback({
        message: "User 2 does not exist.",
      });
    }
  }
  return callback({
    message: "Error Request Failed",
  });
}

async function deleteFollowRequest({ userName, deleteRequestFrom }, callback) {
  if (!userName || !deleteRequestFrom) {
    console.log("userName & deleteRequestFrom Missing");
    return callback({ message: "userName & deleteRequestFrom is required" });
  }

  const user = await User.findOne({ userName: userName }); //accepts the request
  const user2 = await User.findOne({ userName: deleteRequestFrom }); //the user being deleted

  if (user != null && user2 != null) {
    const hasSentFollowReq = await FollowRequests.findOne({
      userName: userName,
      requests: deleteRequestFrom,
    });

    if (hasSentFollowReq != null) {
      await FollowRequests.findOneAndUpdate(
        {
          //first is filter on the basis of
          userName: userName,
        },
        {
          //use $push if you dont want unique check before pushing
          $pull: {
            requests: deleteRequestFrom,
          },
        }
      );
      return callback(null, "Success");
    } else {
      return callback({
        message: "Has not sent a request to you in the first place",
      });
    }
  } else {
    if (!user) {
      return callback({
        message: "User 1 does not exist.",
      });
    } else if (!user2) {
      return callback({
        message: "User 2 does not exist.",
      });
    }
  }
}

async function acceptFollowRequest({ userName, acceptRequestFrom }, callback) {
  if (!userName || !acceptRequestFrom) {
    console.log("userName & acceotRequestFrom Missing");
    return callback({ message: "userName & acceptRequestFrom is required" });
  }

  const user = await User.findOne({ userName: userName }); //accepts the request
  const user2 = await User.findOne({ userName: acceptRequestFrom }); //the user being accepted

  if (user != null && user2 != null) {
    console.log("Hello we are here");
    //remove the follow request from userName
    await FollowRequests.findOneAndUpdate(
      {
        //first is filter on the basis of
        userName: userName,
      },
      {
        //use $push if you dont want unique check before pushing
        $pull: {
          requests: acceptRequestFrom,
        },
      }
    );
    //add a follower to userName
    await Followers.findOneAndUpdate(
      {
        userName: userName,
      },
      {
        $push: {
          followers: acceptRequestFrom,
        },
      }
    );
    //add following to acceeptRequestFrom
    await Following.findOneAndUpdate(
      {
        userName: acceptRequestFrom,
      },
      {
        $push: {
          following: userName,
        },
      }
    );
    return callback(null, "Success");
  } else {
    return callback({
      message: "one of the two users or both do not exists",
    });
  }
}

async function uploadPost(params, callback) {
  if (!params.mediaURL) {
    return callback({
      message: "Medai needed to upload a post. Media is missing",
    });
  }
  if (!params.challengeID) {
    return callback({
      message: "No post can be uploaded without a valid challenge id",
    });
  }
  if (!params.userName) {
    return callback({
      message: "Have to specify which user is making the post",
    });
  }

  const post = new Posts(params);
  post
    .save()
    .then(async (response) => {
      console.log("Post Saved");
      await MyPosts.findOneAndUpdate(
        {
          userName: params.userName,
        },
        {
          $addToSet: {
            myposts: post._id,
          },
        }
      );

      return callback(null, response);
    })
    .catch((error) => {
      return callback({
        message: "Post Creation Failed",
      });
    });
}

async function togglePostPrivacy({ userName, postID }, callback) {
  if (!postID) {
    return callback({ message: "Cant toggle without PostID -> empty sent" });
  }

  if (!userName) {
    return callback({
      message: "need details of author of post you are trying to delete",
    });
  }

  const post = await Posts.findById({ _id: postID });

  if (!post) {
    return callback({
      message: "the post you are trying to toggle privacy of does not exist",
    });
  } else {
    post.isPrivated = !post.isPrivated;

    post
      .save()
      .then((response) => {
        return callback(null, response);
      })
      .catch((error) => {
        return callback(error);
      });
  }
}

async function deletePost({ userName, postID }, callback) {
  if (!postID) {
    return callback({ message: "Cant delete without PostID -> empty send" });
  }

  if (!userName) {
    return callback({
      message: "need details of author of post you are trying to delete",
    });
  }

  const post = await Posts.findById({ _id: postID });
  if (!post) {
    return callback({
      message: "the post you are trying to delete does not exist",
    });
  } else {
    post
      .delete()
      .then(async (response) => {
        await MyPosts.findOneAndUpdate(
          {
            userName: userName,
          },
          {
            $pull: {
              myposts: postID,
            },
          }
        );
        return callback(null, "Post deleted -> sent from User Services");
      })
      .catch((error) => {
        return callback(error);
      });
  }
}

// async function likePost({ userName, postID }, callback) {
//   if (!postID) {
//     return callback({ message: "Cant delete without PostID -> empty send" });
//   }

//   if (!userName) {
//     return callback({
//       message: "need details of author of post you are trying to delete",
//     });
//   }

//   const post = await Posts.findById({ _id: postID });
//   if (!post) {
//     return callback({
//       message: "the post you are trying to like does not exist",
//     });
//   } else {
//     //check if document is already liked
//     const isLiked =
//       Posts.find({
//         _id: postID,
//         likedbyIDs: userName
//       }).count() > 0;
//     const x = 10;
//     console.log(x)
//     console.log(isLiked)
//     console.log("test")
//     if (isLiked === true) {
//       post.updateOne(
//         {
//           _id: postID,
//         },
//         {
//           $dec: {
//             numberOfLikes: 1,
//           },
//           $pull: {
//             likedByIDs: userName,
//           },
//         }
//       );
//       post
//         .save()
//         .then((response) => {
//           return callback(null, response);
//         })
//         .catch((error) => {
//           return callback(error);
//         });
//     } else {
//       post.updateOne(
//         {
//           _id: postID,
//         },
//         {
//           $inc: {
//             numberOfLikes: 1,
//           },
//           $addToSet: {
//             likedByIDs: userName,
//           },
//         }
//       );
//       post
//         .save()
//         .then((response) => {
//           return callback(null, response);
//         })
//         .catch((error) => {
//           return callback(error);
//         });
//     }
//   }
// }

async function likePost({ userName, postID }, callback) {
  if (!postID) {
    return callback({ message: "Cant delete without PostID -> empty send" });
  }

  if (!userName) {
    return callback({
      message: "need details of author of post you are trying to delete",
    });
  }

  const post = await Posts.findById({ _id: postID });
  if (!post) {
    return callback({
      message: "the post you are trying to like does not exist",
    });
  } else {
    await Posts.findByIdAndUpdate(
      {
        _id: postID,
      },
      {
        $inc: {
          numberOfLikes: 1,
        },
        $addToSet: {
          likedByIDs: userName,
        },
      }
    );
    console.log("I am here --> LIKE")
    return callback(null, "Post liked")
  }
}

async function unLikePost({ userName, postID }, callback) {
  if (!postID) {
    return callback({ message: "Cant delete without PostID -> empty send" });
  }

  if (!userName) {
    return callback({
      message: "need details of author of post you are trying to delete",
    });
  }

  const post = await Posts.findById({ _id: postID });
  if (!post) {
    return callback({
      message: "the post you are trying to like does not exist",
    });
  } else {
    await Posts.findByIdAndUpdate(
      {
        _id: postID,
      },
      {
        $inc: {
          numberOfLikes: -1,
        },
        $pull: {
          likedByIDs: userName,
        },
      }
    );
    console.log("I am here --> UNLIKE")
    return callback(null, "Post Unliked")
  }
}

module.exports = {
  login,
  register,
  updatePassword,
  updatePrivateStatus,
  updateProfilePicture,
  updateProfileBio,
  sendFollowRequest,
  deleteFollowRequest,
  acceptFollowRequest,
  uploadPost,
  togglePostPrivacy,
  deletePost,
  likePost,
  unLikePost,
};
