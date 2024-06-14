const express = require('express'); //initilize the express framework object
const app = express(); //initilize the express object
const cors = require('cors')

const db = require('./models')

app.use(express.json());//tells how to parse json api input
app.use(cors());

//Routers
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter);
const commentsRouter = require('./routes/Comments')
app.use(`/comments`, commentsRouter);
const usersRouter = require('./routes/Users')
app.use(`/auth`, usersRouter);
const likesRouter = require('./routes/Likes')
app.use(`/likes`, likesRouter);


db.sequelize.sync().then(() => { //When we start our api, we also want to go through every table at the models folder at the same time, check if they exist in the db, and if not, make that table.
    app.listen(3001, () => { //Specifies port, and then passes the lambda function which is ran when the server starts.
        console.log("Server running on port 3001")
    });
})
