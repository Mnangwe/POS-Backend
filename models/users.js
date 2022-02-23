const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    contact: {
        type:String,
        required: true
    },
    avatar: {
        type:String,
        required: false
    },
    about: {
        type:String,
        required: false 
    }
})

module.exports = mongoose.model('User', userSchema)