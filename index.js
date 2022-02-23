require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');

// USING MIDDLEWAERS
app.use(express.json())
app.use(cors())

// CONNECTING MONGO
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.on('error', err => console.error(err))
db.once('open', () => console.log('Connected to Database'))

app.set('port', process.env.port || 3000) 

app.get('/', (req, res, next) =>{
    res.send('<h1>Hello world<h1>');
})

app.use('/users', userRouter)
app.use('/posts', postRouter)

app.listen(app.get('port'), server =>{
    console.info(`Server listen on port ${app.get('port')}`);
})