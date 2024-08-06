const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ err: "malformatted ID" });
  }
  if (err.name === "ValidationError" || err.status === 400) {
    return res.status(400).send({ err: err.message });
  }

  res.status(500).send({ err: "Internal Server Error" });
};

module.exports = errorHandler;
