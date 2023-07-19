const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Post = require("../model/postModel");
const middleware = require("../middleware/auth")
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

/**
* @swagger
* components:
*   schemas:
*       Post:
*           type: object
*           properties:
*               _id:
*                   type: string
*                   description: The auto-generated id of the post
*               title:
*                   type: string
*                   description: The post title
*               content:
*                   type: string
*                   description: The post content
*               creator:
*                   type: string
*                   description: The post creator
*               name:
*                   type: string
*                   description: The post name
*/


/**
* @swagger
* tags:
*   name: Post
*   description: All the API routes related to User
*/



/**
* @swagger
* /post/add:
*   post:
*       summary: To post the details of a new user
*       tags: [Tags]
*       security:
*           - bearerAuth:[],
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Post'
*       responses:
*           201:
*               description: The user was post successfully
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Post'
*           500:
*               description: Some server error
*/









router.post("/add", middleware, async (req, res) => {
    try {
        const addPost = await Post.create({ ...req.body, creator: req.userId, name: req.name });

        res.send(addPost);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})

/**
* @swagger
* /users:
* get:
*   summary: This will get all the user data from the database
*   tags: [Users]
*   responses:
*       200:
*           description: The list of all the users
*           content:
*               application/json:
*                   schema:
*                       type: array
*                       item:
*                           $ref: "#/components/schemas/User"
*
*/


router.get("/", middleware, async (req, res) => {
    try {
        const { page } = req.query;
        if (!page)
            page = 1
        const posts = await Post.find().skip((page - 1) * 17).limit(10)
        return res.status(200).json({ data: this.post, surrentPage: page })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})


router.get("/search", middleware, async (req, res) => {
    try {
        const { searchQuery } = req.query
        const title = new RegExp(searchQuery, "i")
        const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] })
        // const posts = await Post.find({ title });
        res.send(posts)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // Add an appropriate error response
    }
})

/**
* @swagger
* /users/update/{id}:
* patch:
*   summary: It will update the user details
*   tags: [Users]
*   parameters:
*       - in: path
*       name: id
*       schema:
*           type: string
*       required: true
*       description: The book id
*   requestBody:
*       required: true
*       content:
*           application/json:
*               schema:
*                   $ref: '#/components/schemas/User'
*   responses:
*       200:
*           description: The user Deatils has been updated
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       404:
*           description: The user was not found
*       500:
*           description: Some error happened
*/


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


/**
* @swagger
* /users/delete/{id}:
*   delete:
*       summary: Remove the user by id
*       tags: [Users]
*       parameters:
*           - in: path
*            name: id
*           schema:
*               type: string
*           required: true
*           description: The user id
*       responses:
*           200:
*               description: The user was deleted
*           404:
*               description: The user was not found
*/



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