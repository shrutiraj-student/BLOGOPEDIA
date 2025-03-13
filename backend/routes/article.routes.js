const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middleware/auth.middleware');



const {createArticle, GetAllArticle, GetArticleById, deleteArticle} = require("../controllers/articleController");


router.post('/create', checkAuth, createArticle); // create an article
router.get('/:id', checkAuth, GetArticleById); // get specific article
router.get('/v1/all', checkAuth, GetAllArticle); // get all article
router.delete('/:id', checkAuth, deleteArticle); // delete specified article

// router.put('/:id'); update specific article



module.exports = router;