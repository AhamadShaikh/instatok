

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoute")

const connection = async () => {
    try {
        await mongoose.connect(`mongodb+srv://Ahamad786:Ahamad4820@cluster0.p86c9yw.mongodb.net/Marvel?retryWrites=true&w=majority`)
    } catch (error) {
        console.log(error)
    }
}

app.use(express.json());

app.use("/user", userRouter)
app.use("/post", postRouter)


app.listen(7000, (err) => {
    connection();
    console.log("server is listening on port 7000")
})