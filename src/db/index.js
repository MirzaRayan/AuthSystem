import mongoose from "mongoose";

const DB_Connection = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECTION}/${process.env.DB_NAME}`);
    console.log('DB connected successfully');
  } catch (error) {
    console.log('DB connection failed',error);
    throw error
  }
};

export default DB_Connection;