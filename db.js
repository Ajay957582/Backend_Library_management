import mongoose from "mongoose";

const dbConnection = async function () {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("database connected succesfully");
  } catch (error) {
    console.log(error, "error from db connection that is mongoose.connect");
  }
};

export default dbConnection;
