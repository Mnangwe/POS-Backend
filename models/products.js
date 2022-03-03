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
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fskillz4kidzmartialarts.com%2Fhome%2Fdefault-image%2F&psig=AOvVaw3r7xJCE4cnsHvARlX2pRu-&ust=1646375604532000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPiv-5qpqfYCFQAAAAAdAAAAABAc"
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