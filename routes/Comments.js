const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const {validateToken} = require('../middlewares/AuthMiddleware');

router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({where : {PostID: postId}});
    res.json(comments)
});

router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    comment.username = req.user.username;;
    try {
        const createdComment = await Comments.create(comment);
        res.status(201).json(createdComment); // Return the created comment with ID
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
})

router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    await Comments.destroy({where: {
        id: commentId
    }})
    res.json("Deleted successfully");
})

module.exports = router;