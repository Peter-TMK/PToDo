const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  validateRegisterMiddleWare,
} = require("../middleware/validator.middleware");

authRouter.post("/register", validateRegisterMiddleWare, register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/request-password-reset", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
