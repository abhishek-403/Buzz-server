const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/create", postController.createPostController);
router.post("/like", postController.likeController);
router.put("/updatePost", postController.updatePostController);
router.delete("/deletePost", postController.deletePostController);

module.exports = router;
