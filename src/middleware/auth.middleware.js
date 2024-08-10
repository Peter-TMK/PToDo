const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).send({ error: "Access Denied!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
