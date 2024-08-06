const express = require("express");
const taskRouter = express.Router();

const {
  getAllTasks,
  getSingleTask,
  postTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const {
  validateTaskPostMiddleWare,
  validateTaskUpdateMiddleWare,
} = require("../middleware/validator.middleware");

taskRouter.get("/", getAllTasks);

taskRouter.get("/:id", getSingleTask);

taskRouter.post("/", validateTaskPostMiddleWare, postTask);

taskRouter.put("/:id", validateTaskUpdateMiddleWare, updateTask);

taskRouter.delete("/:id", deleteTask);

module.exports = taskRouter;
