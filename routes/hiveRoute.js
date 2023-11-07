const router = require("express").Router();
const hiveController = require("../controllers/hiveController");
;
router.post("/create", hiveController.createHiveController);
router.get("/getmyhives", hiveController.getMyHives);

module.exports = router;
