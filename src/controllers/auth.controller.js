const express = require("express");
const app = express();
require("dotenv").config();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const redisClient = require("../middleware/redis.middleware");
// const UserModel = require("../models/user.model");
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

    // console.log(user);
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

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY_REFRESH,
      {
        expiresIn: "7d",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    // Store the token in Redis
    // redisClient.setEx(token, 3600, JSON.stringify({ id: user.id }));

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });
    // console.log(req);

    res.status(200).json({
      message: "Login SUCCESSFUL!",
      email: user.email,
      accessToken,
      refreshToken,
      expiresIn: "1h",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // clear cookies
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });

    // Optionally remove the refresh token from the user document
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await UserModel.updateOne(
        { refreshToken },
        { $unset: { refreshToken: "" } }
      );
    }
    res.json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Password Reset

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    userEmail: process.env.EMAIL_USER,
    password: process.env.PASSWORD_USER,
  },
});

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    // const user = await UserModel.findOne({ where: { email: req.body.email } });
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    // Generate a reset token and set an expiration time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; //1hr

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    await user.save();

    console.log("Your reset token:", resetToken);

    // Send a reset email to the user
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password. The link will expire in 1 hour.</p>`,
    });

    res.status(200).send({ message: "Password Reset has been sent to email!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Invalid or expired reset token!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).send({ message: "Password reset successfully!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
};

// const logout = (req, res, next) => {
//   console.log("Cookies:", req.cookies);
//   const token = req.cookies.jwt;
//   try {
//     if (token) {
//       redisClient.del(token, (err) => {
//         if (err) {
//           return res.status(500).json({ err: err.message });
//         }

//         res.cookie("jwt", "", { maxAge: 1 });
//         return res.staus(200).json({ message: "Logged Out Successfully" });
//       });
//     } else {
//       return res.status(400).json({ message: "No Token provided!" });
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
// const logout = async (req, res) => {
//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     const userId = req.user.id;
//     await redisClient.del(`user:${userId}`);
//     res.status(200).send("Logged out successfully");
//   } catch (error) {
//     // console.error("Error logging out:", error);
//     res.status(500).send("Internal server error");
//   } finally {
//     await redisClient.quit(); // Or leave it open if needed
//   }
// };
