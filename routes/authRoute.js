const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUpController);
router.post("/verifyemail", authController.verifyEmailController);
router.post("/changeusername", authController.changeUserNameController);
// router.post('/login',authController.loginController)
// router.post('/logout',authController.logOutController)
// router.get('/refresh',authController.refreshAccessTokenController)

module.exports = router;
