const mongoose = require("mongoose");
const config = require(".");

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB:", connection.connection.name);
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
module.exports = connectToDB;
