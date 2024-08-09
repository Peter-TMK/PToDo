// const UserModel = require("../models/task.model");
const UserModel = require("../models/user.model");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).send(`User with id:${id} not found!`);
    }
    res.status(200).json(user);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );

    // const updateUser = await UserModel.findById(id);
    if (!updateUser) {
      res.status(404).send(`User with id:${id} not found!`);
    }
    res.status(200).send(updateUser);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send(`User with id:${id} not found!`);
    }
    res.status(204).end();
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

module.exports = { getAllUsers, getSingleUser, updateUser, deleteUser };

// const postTask = async (req, res, next) => {
//   const { title, description, status } = req.body;
//   try {
//     const taskData = new UserModel({
//       title,
//       description,
//       status,
//     });

//     await taskData.save();
//     res.status(201).send(taskData);
//   } catch (error) {
//     // console.log(error);
//     next(error);
//   }
// };

// const searchTaskByTitle = async (req, res, next) => {
//   const { title, status, sortBy, order, page = 1, limit = 2 } = req.query;

//   let sortOptions = {};

//   if (sortBy) {
//     sortOptions[sortBy] = order === "desc" ? -1 : 1;
//   }

//   const skip = (page - 1) * limit;

//   try {
//     const filter = {};

//     if (title) {
//       filter.title = {
//         $regex: title,
//         $options: "i",
//       };
//     }

//     if (status) {
//       filter.status = {
//         // $regex: tags,
//         $in: status.split(","),
//       };
//     }
//     const totalTasks = await UserModel.countDocuments(filter);

//     const tasks = await UserModel.find(filter)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(Number(limit));

//     res.status(200).json({
//       total: totalTasks,
//       page: Number(page),
//       pages: Math.ceil(totalTasks / limit),
//       tasks,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
