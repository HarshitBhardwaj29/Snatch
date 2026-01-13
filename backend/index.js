import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

console.log("🌎 Environment variables loaded:");
import { configureCloudinary } from "./utils/cloudinary.js";
configureCloudinary();

import {app} from './app.js'
import connectDB from "./db/index.js";


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is runnig at port : ${process.env.PORT}`)
    })
})

.catch((err)=>{
    console.log("MOngo db connection failed!!!",err)
})
