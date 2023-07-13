const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
})

const Post = mongoose.model("post", postSchema)

module.exports = Post