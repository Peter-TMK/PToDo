const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/config/database");
const errorHandler = require("./src/config/errorHandler");
// const TaskModel = require("./src/models/task.model");
const taskRouter = require("./src/routes/task.route");

const {
  getAllTasks,
  getSingleTask,
  postTask,
  updateTask,
  deleteTask,
} = require("./src/controllers/task.controller");
// const userModel = require("./src/models/user.model");

const app = express();
app.use(express.json());
connectDB();

// Defining a custom token for morgan to log the request body for POST requests
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Middleware for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.use("/api/task", taskRouter);
app.use(errorHandler);
module.exports = app;
