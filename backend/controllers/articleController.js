const User = require('../model/user.model');
const Article = require('../model/article.model');
const Comment = require('../model/comment.model');



exports.createArticle = async (req, res) => {
    try {
        const {title, description, thumbnail_url} = req.body;
        const userId = req.user._id ;
        console.error("Yeh pakkar id: ", userId);

         if(!title || !description|| !thumbnail_url) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newArticle = await Article.insertOne({
            title,
            description,
            author: userId,
            thumbnail_url
        })

        let useResponse = await User.findOne({_id: userId});
        console.log("useResponse",useResponse)

        if(!useResponse) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        useResponse.userArticle.push(newArticle._id);
        await useResponse.save();

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: newArticle
        })
    }
    catch(error) {
        console.warn("Errror occurred in createArticle of articleController.js ");
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        })
    }
}




exports.GetAllArticle = async (req, res) => {
    try {
        const articleDetails = await Article.find({}).populate("comments")
                                                    .populate("author")
                                                    .exec();
        res.status(200).json({
            success: true,
            message: 'Article fetched successfully',
            data: articleDetails
        })
    }
    catch(error) {
        console.warn("Errror occurred in GetAllArticle of articleController.js ");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        })
    }
}




exports.GetArticleById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({ message: 'Article ID is required' });
        }   

        const articleDetails = await Article.findById({_id: id})
                                                                .populate('comments', {})
                                                                .exec();
                                                                
        if(!articleDetails) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Article fetched successfully',
            data: articleDetails
        })
    }
    catch(error) {
        console.warn("Errror occurred in GetArticleById of articleController.js ");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        })
    }
}



exports.deleteArticle = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;


        if(!id) {
            return res.status(400).json({ message: 'Article ID is required' });
        }
        
        await Article.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        })

        // remove article from user's article list
        await User.updateOne(
            {_id: userId},
            { $pull: { userArticle: id } }
        )
    }
    catch(error) {
        console.warn("Errror occurred in deleteArticle of articleController.js ");
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: error.message
        })
    }
}