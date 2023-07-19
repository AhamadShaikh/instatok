const { default: mongoose } = require("mongoose");
const jwt=require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile_no: { type: Number, required: true },
    age: { type: Number, required: true }
})

// userSchema.pre("save")

userSchema.methods.sayBahu=function(){
    return this.name+this.password
}

userSchema.methods.generateToken=function(){
     const token = jwt.sign(
        { userId: this._id, name: this.name },
        "ironman",
        { expiresIn: "2d" }
      );
      return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User