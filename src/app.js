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
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import likesRouter from "./routes/like.routes.js"
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"


//routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/likes", likesRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)

// * example:- app.use("/users", userRouter) //* Here the users is the prefix i.e http://localhost:8000/users/register

export default app