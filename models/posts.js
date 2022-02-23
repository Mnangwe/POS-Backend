const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    body: {
        type:String,
        required: true
    },
    image: {
        type:String,
        required: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: {
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Posts', userSchema)