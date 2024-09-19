import mongoose from "mongoose";

mongoose.set("strictQuery", false);

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
