const TaskModel = require("../models/task.model");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find({});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getSingleTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      res.status(404).send(`Article with id:${id} not found!`);
    }
    res.status(200).json(task);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const postTask = async (req, res, next) => {
  const { title, description, status } = req.body;
  try {
    const taskData = new TaskModel({
      title,
      description,
      status,
    });

    await taskData.save();
    res.status(201).send(taskData);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const updateTask = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    // const updateTask = await TaskModel.findById(id);
    if (!updateTask) {
      res.status(404).send(`Article with id:${id} not found!`);
    }
    res.status(200).send(updateTask);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      res.status(404).send(`Article with id:${id} not found!`);
    }
    res.status(204).end();
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const searchTaskByTitle = async (req, res, next) => {
  const { title, status, sortBy, order, page = 1, limit = 2 } = req.query;

  let sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  }

  const skip = (page - 1) * limit;

  try {
    const filter = {};

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (status) {
      filter.status = {
        // $regex: tags,
        $in: status.split(","),
      };
    }
    const totalTasks = await TaskModel.countDocuments(filter);

    const tasks = await TaskModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total: totalTasks,
      page: Number(page),
      pages: Math.ceil(totalTasks / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  postTask,
  updateTask,
  deleteTask,
  searchTaskByTitle,
};
