import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"})) //the urlencoded is used for the urls we can that spaces are replaced by %20 it is the work of urlendoec
app.use(express.static("public")) //any assets such as images or any pdf which I have to keep on server I can keep it in public folder which I have created
//*the cookie parser is used to access the users browser cookie and set them or perform CRUD operations on them>>
app.use(cookieParser())

//*Routes

import userRouter from "./routes/user.routes.js"



//routes declaration

app.use("/api/v1/users", userRouter)

// * example:- app.use("/users", userRouter) //* Here the users is the prefix i.e http://localhost:8000/users/register

export default app