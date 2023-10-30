const Hive = require("../models/Hive");
const { error, success } = require("../utils/responseWrapper");

const createHiveController = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const hive = await Hive.create({
      name,
      description,
      visibility,
      creator: req._id,
      admins: req._id,
    });

    console.log({ hive });
    return res.send(success(200, "Success"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createHiveController,
};
