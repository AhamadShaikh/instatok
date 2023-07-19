

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoute")
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require('swagger-jsdoc');
require("dotenv").config()
const cors = require("cors")

app.use(express.json());
app.use(express.text());
app.use(cors());

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
    }
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Learning Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:7000"
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use("/user", userRouter)
app.use("/post", postRouter)

app.use(cors({
    origin: 'http://localhost:3000'
}));


app.listen(7000, (err) => {
    connection();
    console.log("server is listening on port 7000")
})