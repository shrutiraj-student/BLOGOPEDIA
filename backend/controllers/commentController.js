const Comment = require('../model/comment.model');
const Article = require("../model/article.model")
const User = require("../model/user.model");
const mongoose = require("mongoose");


const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const articleId = req.params.id;
        const userId = req.user._id;

        if (!userId || !articleId || !text) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }

        const newComment = await Comment.create({
            author: userId,
            text: text,
            article: articleId,
        })

        let article = await Article.findOne({ _id: articleId });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            })
        }

        article.comments.push(newComment._id);
        await article.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: newComment
        })

    }
    catch (error) {
        console.warn("Errror occurred in createComment of commentController.js ");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        })
    }
}



const getCommentByArticleId = async (req, res) => {
    try {
        const articleId = req.params.id;

        if (!articleId) {
            return res.status(400).json({
                success: false,
                message: 'Article ID is required'
            });
        }

        const comments = await Comment.find({ article: articleId })
            .populate('author', 'name email').exec()

        // console.log(comments);

        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: comments
        });
    } catch (error) {
        console.warn("Error occurred in getCommentByArticleId of commentController.js");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        });
    }
};


const deleteCommentByArticleId = async (req, res) => {
    try {
        const commentId = req.params.id;

        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'Comment ID is required'
            });
        }

        // Check if the commentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Comment ID'
            });
        }

        const commentDetails = await Comment.findById(commentId);

        if (!commentDetails) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Delete specific comment from mapped article
        const articleDetails = await Article.findOneAndUpdate(
            { _id: commentDetails.article },
            { $pull: { comments: commentDetails._id } },
            { new: true } 
        );

        if (!articleDetails) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Delete the comment from the Comment collection
        await Comment.deleteOne({ _id: commentId });

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: commentDetails,
            article: articleDetails,
        });

    } catch (error) {
        console.warn("Error occurred in deleteCommentByArticleId of commentController.js");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        });
    }
};

module.exports = { createComment, getCommentByArticleId, deleteCommentByArticleId }