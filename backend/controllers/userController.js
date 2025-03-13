const User = require('../model/user.model')
const Contact = require("../model/contact.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const registerUser = async (req, res) => {
    let { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields required!" })
    } else {
        try {
            let user = await User.findOne({ email: email })
            if (user) {
                return res.status(400).json({ success: false, message: "Email already exists!" })
            } else {
                let newUser = await User.create({
                    name: name,
                    email: email,
                    password: password
                })
                return res.status(200).json({ success: true, message: "Registration successfull!", data: newUser })
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    }
}



const loginUser = async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required!" })
    } else {
        try {
            let user = await User.findOne({ email: email })
            if (!user) {
                return res.status(400).json({ success: false, message: "User Does'nt exist" })
            } else {
                let isPasswordMatch = await bcrypt.compare(password, user.password)
                if (!isPasswordMatch) {
                    return res.status(400).json({ success: false, message: "Invalid Password" })
                }
                //  lets create token
                let payload = {
                    _id: user._id,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
                return res.status(200).json({ success: true, message: "Login Succesfull", token: token })
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    }

}

const userProfile = (req, res) => {
    console.log('user profile done');

    let user = req.user;
    delete user._doc.password;
    res.status(200).json({ success: true, message: "User Profile", data: user })
}




// store contact details >>>>

const userContactDetailshandler = async (req, res) => {
    let { name, email, message } = req.body
    if (!name ||!email ||!message) {
        return res.status(400).json({ success: false, message: "All fields required!" })
    } 
    try {
        let newContact = await Contact.create({
            name: name,
            email: email,
            message: message
        })
        return res.status(200).json({ success: true, message: "Contact details stored successfully!", data: newContact })
    } 
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    userProfile,
    userContactDetailshandler
}
