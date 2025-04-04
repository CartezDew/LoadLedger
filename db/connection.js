import dotenv from "dotenv";
dotenv.config();  
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to LoadLedger ${mongoose.connection.name}.`);
});