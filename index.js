require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const path = require('path')
const userRouter = require('./routers/userRouter');
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.use(cors({ 
    credentials: true,
    origin: process.env.NODE_ENV === 'dev' ? process.env.DEV_CLIENT_URL : process.env.PRO_CLIENT_URL}))

app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname,'public')))



app.use(function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
    });

app.use("/", userRouter)



const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

