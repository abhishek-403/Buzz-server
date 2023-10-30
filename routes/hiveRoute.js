const router = require("express").Router();
const hiveController = require("../controllers/hiveController");
;
router.post("/create", hiveController.createHiveController);

module.exports = router;
