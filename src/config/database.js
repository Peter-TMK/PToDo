const mongoose = require("mongoose");
// require("dotenv/config");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Database connection is SUCCESSFULL - ${connection.connection.host}`
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
