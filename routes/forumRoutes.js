const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all posts with author details and nested comments
router.get('/posts', async (req, res) => {
    try {
        const posts = await db.getPosts();
        const postsWithComments = await Promise.all(posts.map(async post => {
            const comments = await db.getCommentsByPostId(post.id);
            const nestedComments = await Promise.all(comments.map(async comment => {
                comment.replies = await db.getCommentsByParentCommentId(comment.id);
                return comment;
            }));
            return { ...post, comments: nestedComments };
        }));
        res.json(postsWithComments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Create a new post
router.post('/posts', async (req, res) => {
    const { authorId, content } = req.body;
    if (!authorId || !content) {
        return res.status(400).json({ error: 'Author ID and content are required' });
    }

    try {
        const post = await db.createPost(authorId, content);
        const author = await db.getUserById(authorId);
        post.authorName = author.name;
        post.authorRole = author.role;
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Edit a post
router.put('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const { authorId, content } = req.body;
    if (!authorId || !content) {
        return res.status(400).json({ error: 'Author ID and content are required' });
    }

    try {
        const post = await db.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.author_id !== authorId) {
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        await db.updatePost(postId, content);
        const updatedPost = await db.getPostById(postId);
        const author = await db.getUserById(authorId);
        updatedPost.authorName = author.name;
        updatedPost.authorRole = author.role;
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Error editing post' });
    }
});


// Route to delete a post
router.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    try {
        await deletePost(postId, userId);
        res.sendStatus(204); // No Content
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

// Add a comment to a post or a parent comment
router.post('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { authorId, content, parentCommentId = null } = req.body;
    if (!authorId || !content) {
        return res.status(400).json({ error: 'Author ID and content are required' });
    }

    try {
        const comment = await db.addComment(postId, authorId, content, parentCommentId);
        const author = await db.getUserById(authorId);
        comment.authorName = author.name;
        comment.authorRole = author.role;
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Error adding comment' });
    }
});

// Edit a comment
router.put('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { authorId, content } = req.body;
    if (!authorId || !content) {
        return res.status(400).json({ error: 'Author ID and content are required' });
    }

    try {
        const comment = await db.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.author_id !== authorId) {
            return res.status(403).json({ error: 'Not authorized to edit this comment' });
        }

        await db.updateComment(commentId, content);
        const updatedComment = await db.getCommentById(commentId);
        const author = await db.getUserById(authorId);
        updatedComment.authorName = author.name;
        updatedComment.authorRole = author.role;
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Error editing comment' });
    }
});

// Route to delete a comment
router.delete('/comments/:id', async (req, res) => {
    const commentId = req.params.id;
    const userId = req.body.userId;
    try {
        await deleteComment(commentId, userId);
        res.sendStatus(204); // No Content
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

module.exports = router;

