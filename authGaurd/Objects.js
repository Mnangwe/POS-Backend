const Product = require('../models/products')
const User = require('../models/users')
const auth = require('./auth')

async function getProduct(req, res, next) {
    let product
    try {
      product = await Product.findById(req.params.id)
      if(!product) res.status(404).json({ msg: 'Cannot find product'})
    }catch (err) {
      res.status(500).send({ msg: err.message })
    }

    res.product = product
    next()
}



async function getUser(req, res, next) {
    let user
    try {
    user = await User.findById(req.params.id)
    if(!user) res.status(404).json({ msg: 'Cannot find user'})
    }catch (err) {
    res.status(500).send({ msg: err.message })
    }

    res.user = user

    next()
  }


module.exports = {getProduct,getUser}