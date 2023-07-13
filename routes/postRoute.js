const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Post = require("../model/postModel");
const middleware = require("../middleware/auth")

router.post("/add", middleware, async (req, res) => {
    try {
        const addPost = await Post.create({ ...req.body, creator: req.userId, name: req.name });
        await addPost.populate("creator") // Fix the populate method
        res.send(addPost);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})

router.get("/", middleware, async (req, res) => {
    try {
        const posts = await Post.find({});
        res.send(posts)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})


router.get("/search", middleware, async (req, res) => {
    try {
        const { searchQuery } = req.query
        const title = new RegExp(searchQuery, "i")
        const posts = await Post.find({ title });
        res.send(posts)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})

router.patch("/update/:postId", middleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        console.log(post.creator.toString(), req.userId)
        if (post.creator.toString() === req.postId) {
            res.send("no")
        }
        const updatePost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true })
        res.send(updatePost)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})


router.delete("/delete/:postId", middleware, async (req, res) => {
    const postId = req.params.postId
    try {
        const post = await Post.findById(req.params.postId)
        // console.log(post.creator.toString(), req.userId)
        if (post.creator.toString() === req.postId) {
            res.send("no")
        }
        const deletePost = await Post.findByIdAndDelete(postId);
        if (!deletePost) {
            return res.status(400).json({ error: 'Book not found' });
        }
        res.status(200).json({ msg: 'Book has been deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete the book' });
    }
})

module.exports = router