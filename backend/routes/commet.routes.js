const express = require('express')
const router = express.Router();

const {checkAuth} = require('../middleware/auth.middleware');
const {createComment, getCommentByArticleId, deleteCommentByArticleId} = require("../controllers/commentController");

router.post('/make/:id',checkAuth, createComment)
router.get('/get/:id',checkAuth, getCommentByArticleId)

router.delete('/:id',checkAuth, deleteCommentByArticleId)
// router.put('/update-article',checkAuth,createComment)


module.exports = router