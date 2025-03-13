const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'name should be atleast 3 characters'],
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        

    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
    likedArticle: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            // required: true,
        }
    ],
    userArticle: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
        }   
    ],
    token: {
        type: String,
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});






userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.token = token;
        return token;
    } catch (err) {
        console.log(err);
    }
};



userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (err) {
        console.log(err);
    }
};
module.exports = mongoose.model('User', userSchema);


// match: [/.+@+\..+/, 'Please enter a valid email'],
// minlength: [5, 'email should be atleast 5 characters'],