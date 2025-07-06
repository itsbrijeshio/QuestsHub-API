import mongoose from "mongoose";
import envs from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(envs.MONGODB_URI as string);
    console.log("DB Connected!");
  } catch (error) {
    console.error("DB Err: ", error);
    process.exit(1);
  }
};

export default connectDB;
