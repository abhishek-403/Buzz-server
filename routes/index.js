const router = require("express").Router();
const authRoute = require("./authRoute");
const postRoute = require("./postRoute");
const userRoute = require("./userRoute");

router.use("/auth", authRoute);
// router.use("/post", postRoute);
// router.use("/user", userRoute);

module.exports = router;
