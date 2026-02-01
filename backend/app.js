import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.CORS_ORIGIN,
    ],
    credentials:true,
}))

//configration 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit :"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes

import userRouter from './routes/user.routes.js'
import adminRouter from "./routes/admin.routes.js"
import cartRouter from "./routes/cart.routes.js"
import productRouter from "./routes/product.routes.js"

app.use("/api/v1",userRouter);
app.use("/api/v1",adminRouter)
app.use("/api/v1",cartRouter)
app.use("/api/v1",productRouter);


export {app};