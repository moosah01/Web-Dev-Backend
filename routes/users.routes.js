const userController = require('../controllers/users.controllers')

const express = require('express');
const app = express();

const router = express.Router();

// router.('/register', (req,res) => {
//     res.send("You have succesfully tested the router \nHello I am Way #1");
// });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/updatePassword", userController.updatePassword);
router.post("/updateProfilePicture", userController.updateProfilePicture);
router.post("/updatePrivateStatus", userController.updatePrivateStatus);
router.post("/updateProfileBio", userController.updateProfileBio);
router.post("/sendFollowRequest", userController.sendFollowRequest);
router.post("/deleteFollowRequest", userController.deleteFollowRequest);
router.post("/acceptFollowRequest", userController.acceptFollowRequest);
router.post("/uploadPost", userController.uploadPost);
router.post("/togglePostPrivacy", userController.togglePostPrivacy);
router.post("/deletePost", userController.deletePost);
router.post("/likePost", userController.likePost);
router.post("/unLikePost", userController.unLikePost);

//get because retrieving info
router.get("/getUserProfile", userController.userProfile);

module.exports = router;
