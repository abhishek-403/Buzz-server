const router = require("express").Router();
const upload = require("../middlewares/multer");
const { requireUser } = require("../middlewares/requireuser");
const authRoute = require("./authRoute");
const postRoute = require("./postRoute");
const userRoute = require("./userRoute");
const searchRoute = require("./searchRoute");

router.use("/auth", authRoute);
router.use("/post", requireUser, postRoute);
router.use("/user", requireUser, userRoute);
router.use("/search", requireUser,searchRoute);

module.exports = router;
