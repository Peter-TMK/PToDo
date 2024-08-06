const joi = require("joi");
const TaskModel = require("../models/task.model");

const uniqueTaskTitle = async (value, helper) => {
  const existingTaskTitle = await TaskModel.findOne({ title: value });
  if (existingTaskTitle) {
    throw new Error("Each Task's Title Must Be Unique!");
  }
  return value;
};

const validateTaskPost = joi.object({
  title: joi.string().min(3).max(50).required().external(uniqueTaskTitle),
  description: joi.string().min(5).max(1000),
  status: joi.array().items(joi.string()).optional(),
  //   dueDate,
});
const validateTaskUpdate = joi.object({
  title: joi.string().min(3).max(50).required().external(uniqueTaskTitle),
  description: joi.string().min(5).max(1000),
  status: joi.array().items(joi.string()).optional(),
  //   dueDate,
});

async function validateTaskPostMiddleWare(req, res, next) {
  const payload = req.body;
  try {
    await validateTaskPost.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    // res.status(400).json({ error: error.details[0].message });
    next({
      // message: error.details[0].message,
      message: error.message,
      status: 400,
    });
  }
}

async function validateTaskUpdateMiddleWare(req, res, next) {
  const payload = req.body;
  try {
    await validateTaskUpdate.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    // res.status(400).json({ error: error.details[0].message });
    next({
      // message: error.details[0].message,
      message: error.message,
      status: 400,
    });
  }
}

module.exports = { validateTaskPostMiddleWare, validateTaskUpdateMiddleWare };
