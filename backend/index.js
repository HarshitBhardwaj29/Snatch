import dotenv from "dotenv";
dotenv.config();

import { configureCloudinary } from "./utils/cloudinary.js";
import { app } from "./app.js";
import connectDB from "./db/index.js";

configureCloudinary();
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
  });

