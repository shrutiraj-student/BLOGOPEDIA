const mongoose = require('mongoose');
require("dotenv").config();


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name should be at least 3 characters'],
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = mongoose.model('Contact', contactSchema);