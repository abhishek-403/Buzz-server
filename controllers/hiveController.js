const Hive = require("../models/Hive");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");

const createHiveController = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    if (!name) {
      return res.send(error(403, "Hive name required"));
    }
    const me = await User.findById(req._id);
    const hive = await Hive.create({
      name,
      description,
      visibility,
      creator: { _id: req._id, avatar: me.avatar },
      admins: req._id,
    });

    me.hives.push(hive._id);
    await me.save();
    await hive.save();

    return res.send(success(200, "Hive created"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyHives = async (req, res) => {
  try {
    const me = await User.findById(req._id).populate("hives");
   
    return res.send(success(200, { hives: me.hives }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createHiveController,
  getMyHives,
};
