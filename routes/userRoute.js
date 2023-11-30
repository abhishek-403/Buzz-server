const router = require("express").Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/multer");

router.get("/getmyprofile", userController.getMyProfile);
router.post("/getmyfeed", userController.getMyFeedController);
router.post("/getmyallfeed", userController.getMyAllFeedController);
router.post("/getmyposts", userController.getMyPostsController);
router.post("/getUsersPosts", userController.getUsersPostsController);
router.post("/followUser", userController.followController);
router.post(
  "/editprofile",
  upload.single("avatar"),
  userController.editMyProfile
);

// router.post('/follow', requireUser, userController.followController)
// router.get('/getfeeddata', requireUser, userController.getFeedData)
// router.get('/getallusers', requireUser, userController.getAllUsers)
// router.get('/getmyposts', requireUser, userController.getMyPosts)
// router.get('/getanypost', requireUser, userController.getAnyPost)
// router.get('/getusersposts', requireUser, userController.getUsersPost)

// router.post('/getusersprofile', requireUser, userController.getUsersProfile)

// router.put('/', requireUser, userController.updateProfile)

// router.delete('/deleteprofile', requireUser, userController.deleteMyProfile)

module.exports = router;
