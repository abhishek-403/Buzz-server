const router = require("express").Router();
const postController = require("../controllers/postController");
const upload = require("../middlewares/multer");

router.post("/create",upload.single('images'),postController.createPostController);
router.post("/createtextpost",postController.createTextPostController);

router.post("/like", postController.likeController);
router.post("/comment", postController.commentOnPost);
router.post("/deletecomment", postController.deleteComment);
router.post("/getallcomments", postController.getAllComments);
// router.put("/updatePost", postController.updatePostController);
// router.delete("/deletePost", postController.deletePostController);

module.exports = router;
