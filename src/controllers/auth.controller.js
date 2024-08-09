const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
// const userModel = require("../models/user.model");

const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isEmailExist = await UserModel.findOne({ email });

    if (isEmailExist) {
      res.status(400).send({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ email, password: hashedPassword });

    console.log(user);
    await user.save();

    // Destructuring the user to send other details except password
    // const { password, ...others } = user._doc;

    res.status(201).json({ message: "User REGISTERED successfully!", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(401).send({ error: "Please Your Enter Email or Password!" });
    }

    const user = await UserModel.findOne({ email });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send({ error: "Incorrect Email or Password!" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY || helloTODOAPI,
      {
        expiresIn: "1h",
      }
    );

    // console.log(req);

    res.status(200).json({
      message: "Login SUCCESSFUL!",
      email: user.email,
      token,
      expiresIn: "1h",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { register, login };
