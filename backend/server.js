const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


const port = process.env.PORT || 6000 ;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const dbConnection = require('./config/database');
dbConnection();



const userRoutes = require('./routes/user.routes')
const articleRoutes = require('./routes/article.routes');
const commentRoutes = require('./routes/commet.routes');

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/comment', commentRoutes);



app.get('/', (req, res) => {``
    res.send('<h1>Hello World!</h1>');
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})