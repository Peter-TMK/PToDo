const mongoose = require("mongoose");

const validateObjectID = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ err: "Malformatted ID" });
  }
  next();
};

module.exports = validateObjectID;
