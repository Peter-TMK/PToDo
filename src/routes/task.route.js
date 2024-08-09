const express = require("express");
const taskRouter = express.Router();

const {
  getAllTasks,
  getSingleTask,
  postTask,
  updateTask,
  deleteTask,
  searchTaskByTitle,
} = require("../controllers/task.controller");

const {
  validateTaskPostMiddleWare,
  validateTaskUpdateMiddleWare,
} = require("../middleware/validator.middleware");

const validateObjectID = require("../middleware/validateObjectID.middleware");
const authenticate = require("../middleware/auth.middleware");

taskRouter.get("/search", searchTaskByTitle);

taskRouter.get("/", getAllTasks);

taskRouter.get("/:id", validateObjectID, getSingleTask);

taskRouter.post("/", authenticate, validateTaskPostMiddleWare, postTask);

taskRouter.put(
  "/:id",
  authenticate,
  validateObjectID,
  validateTaskUpdateMiddleWare,
  updateTask
);

taskRouter.delete("/:id", authenticate, deleteTask);

module.exports = taskRouter;
