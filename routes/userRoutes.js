

const express = require("express");
const User = require("../model/userModel");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const blacklistToken = require("../model/blacklist")


router.get("/", (req, res) => {
    res.send("welcome user route")
})

router.post("/register", async (req, res) => {
    const { password } = req.body
    try {
        const newPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ ...req.body, password: newPassword })
        if (!user) {
            res.status(400).json({ msg: "regitration failed" })
        }
        res.status(200).json({ msg: "successfully registered" })
    } catch (error) {
        res.status(400).json({ msg: "registration failed" })
    }
})

router.post("/login", async (req, res) => {
    const { name, email, password, mobile_no, age } = req.body
    try {
        const existingUser = await User.findOne({ email });

        const verify = await bcrypt.compare(password, existingUser.password)

        if (!verify) {
            res.status(200).json({ msg: "wrong credentials" })
        }

        const token = jwt.sign({ userId: existingUser._id, name: existingUser.name }, "ironman", { expiresIn: "2d" })

        const refreshToken = jwt.sign({ userId: existingUser._id, name: existingUser.name }, "thanos", { expiresIn: "7d" })

        res.status(200).json({ msg: "login successful", token, refreshToken })
    } catch (error) {
        res.status(400).json({ msg: "registration failed" })
    }
})


router.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(400).json({ error: 'Token not provided' });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await blacklistToken.exists({ token });
        if (isBlacklisted) {
            return res.status(400).json({ error: 'Token has already been invalidated' });
        }

        // Blacklist the token
        await blacklistToken.create({ token });

        res.status(200).json({ msg: 'User has been logged out' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log out' });
    }
})

module.exports = router