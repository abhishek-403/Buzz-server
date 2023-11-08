const router = require("express").Router();
const hiveController = require("../controllers/hiveController");
;
router.post("/create", hiveController.createHiveController);
router.get("/getmyhives", hiveController.getMyHives);
router.post("/getonehiveinfo", hiveController.getOneHiveInfo);
router.post("/addmember", hiveController.addMember);
router.post("/removemember", hiveController.removeMember);
router.post("/addpost", hiveController.addPost);
router.post("/removepost", hiveController.removePost);
router.post("/searchusertoadd", hiveController.searchUserToAdd);

module.exports = router;
