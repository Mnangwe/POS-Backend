const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    categories: {
        type: Array
    },
    desc: {
        type: String
    },
    image: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    user_id: {
        type:String,
        required: true
    },
    quantity: {
        type:Number,
        required:false,
        default:1
    }
    
}, {timestamps:true})

module.exports = mongoose.model('Product', productSchema)