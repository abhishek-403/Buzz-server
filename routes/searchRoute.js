const router = require("express").Router();
const searchController = require("../controllers/searchController");


router.post("/searchusers", searchController.searchUsersController);


module.exports=router