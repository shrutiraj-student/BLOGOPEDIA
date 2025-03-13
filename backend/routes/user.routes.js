const express = require('express');
const router = express.Router();


const {registerUser, userProfile, loginUser, userContactDetailshandler} = require("../controllers/userController");
const {checkAuth} = require("../middleware/auth.middleware")



router.post("/register", registerUser);

router.post("/login", loginUser)

router.post("/user-profile", checkAuth, userProfile);

router.post('/user-contact-details', checkAuth, userContactDetailshandler);



module.exports = router;