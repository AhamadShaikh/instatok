const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile_no: { type: Number, required: true },
    age: { type: Number, required: true }
})

const User = mongoose.model("User", userSchema)

module.exports = User