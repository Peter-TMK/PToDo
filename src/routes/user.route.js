const express = require("express");
const userRouter = express.Router();

const {
  validateTaskPostMiddleWare,
  validateTaskUpdateMiddleWare,
  validateUserUpdateMiddleware,
} = require("../middleware/validator.middleware");

const validateObjectID = require("../middleware/validateObjectID.middleware");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

// userRouter.get("/search", searchTaskByTitle);

userRouter.get("/", getAllUsers);

userRouter.get("/:id", validateObjectID, getSingleUser);

// userRouter.post("/", validateTaskPostMiddleWare, postTask);

userRouter.put(
  "/:id",
  validateObjectID,
  validateUserUpdateMiddleware,
  updateUser
);

userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
