const mongoose = require('mongoose');
require('dotenv').config();


const dbConnection = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connection successful 👍');
    })
    .catch((error) => {
        console.error('Database connection error:', error.message);
    });
}

module.exports = dbConnection;