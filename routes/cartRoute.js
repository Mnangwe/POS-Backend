const express = require('express');
const router = express.Router();
const Cart = require('../models/cart')
const authenticateToken = require('../authGaurd/auth');


router.post('/', authenticateToken, async (req, res) => {
    let cart = new Cart(req.body)
    try {
        const newCart = await cart.save()
        res.status(200).json(newCart)
    }catch (err) {
        res.status(400).json({ msg: err.message })
    }
    // const user = req.user[0]
    // console.log(user)
    // const cart = new Cart({
    //     products: [
    //         product_id, quantity
    // ],
    //     user_cartId: user._id
    // })
    // try {
    //     const newCart = await cart.save()
    //     res.json(newCart)
    // }catch (err){
    //     res.json(err)
    // }
})

//62162cdf98cd0c66cd353042

// READING cartS
router.get('/', authenticateToken, async (req, res) => {
    const qNew = req.query.new;
    try {
        let carts
        if(qNew) {
            carts = await Cart.find().sort({date: -1}).limit(5)
        }else {
            carts = await Cart.find();
        }

        res.status(200).json(carts)
         
    } catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// READING A cart
router.get('/:userId', authenticateToken, async (req, res) => {
    // let user = req.user[0]
    try {
        let cart = await Cart.findOne({ user_id: req.params.user_id})
        res.send(cart)
    } catch(err) {
        res.status(403).json({ msg: err.message })
    }
    
})

// UPDATE A cart
router.put('/:id', authenticateToken, getCart, async (req, res) => {
    // let d = new Date()
    // if(req.body.image != null) res.cart.image = req.body.image
    // if(req.body.title != null) res.cart.title = req.body.title 
    // if(req.body.body != null) res.cart.body = req.body.body 
    // res.cart.date = d.toLocaleString()

    // try {
    //     const updatedcart = await res.cart.save()
    //     res.json(updatedcart)
    // }catch (err){
    //     res.status(400).json({ msg: err.message })
    // }
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
            );
            res.status(200).json(updatedCart)
    }catch (err) {
        res.status(500).json({msg: err.message})
    }
})

// DELETE cart
router.delete('/:id', getCart, async (req, res) => {
    try{
        await res.cart.remove()
        res.json({ msg: 'Product has been deleted from cart'})
    }catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// MIDDLEWARE
async function getCart(req, res, next) {
    let cart
    try {
      cart = await Cart.findOne(req.params.id)
      if(!cart) res.status(404).json({ msg: 'Cannot find cart'})
    }catch (err) {
      res.status(500).send({ msg: err.message })
    }

    res.cart = cart
    next()
}

module.exports = router;