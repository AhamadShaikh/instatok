const { default: mongoose } = require("mongoose");

const blackListSchema = new mongoose.Schema({
    bToken: { type: String, required: true }
})

const blacklistToken = mongoose.model("blacklistToken", blackListSchema)

module.exports = blacklistToken