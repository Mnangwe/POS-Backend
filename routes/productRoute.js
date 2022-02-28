require('dotenv').config()
const express = require('express');
const router = express.Router();
const Product = require('../models/products')
const authenticateToken = require('../authGaurd/auth');
const {getProduct} = require('../authGaurd/Objects')


router.post('/', authenticateToken, async (req, res) => {
    let d = new Date();
    const user = req.user[0]
    console.log(user)
    const product = new Product({
        title: req.body.title,
        categories: req.body.categories,
        image: req.body.image,
        date: d.toLocaleString(),
        price: req.body.price,
        user_id: user._id
    })
    try {
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    }catch (err) {
        res.status(400).json({ msg: err.message })
    }
})

// READING productS
router.get('/', authenticateToken, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products
        if(qNew) {
            products = await Product.find().sort({date: -1}).limit(5)
        }else if(qCategory) {
            products = await Product.find({
                categories:{
                $in: [qCategory],
            }
        })
        }else {
            products = await Product.find();
        }

        res.status(200).json(products)
         
    } catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// READING A product
router.get('/:id', authenticateToken, getProduct, (req, res) => {
    try {
        res.send(res.product)
    } catch(err) {
        res.status(403).json({ msg: err.message })
    }
    
})

// UPDATE A product
router.put('/:id', authenticateToken, getProduct, async (req, res) => {
    let d = new Date()
    if(req.body.image != null) res.product.image = req.body.image
    if(req.body.title != null) res.product.title = req.body.title 
    if(req.body.body != null) res.product.body = req.body.body 
    res.product.date = d.toLocaleString()

    try {
        const updatedproduct = await res.product.save()
        res.json(updatedproduct)
    }catch (err){
        res.status(400).json({ msg: err.message })
    }
})

// DELETE product
router.delete('/:id', getProduct, async (req, res) => {
    try{
        await res.product.remove()
        res.json({ msg: '1 person deleted'})
    }catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// MIDDLEWARE


module.exports = router;