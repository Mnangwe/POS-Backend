require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const {getProduct, getUser} = require('../authGaurd/Objects')
const auth = require('../authGaurd/auth');

// CREATING A USER
router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
    const user = new User({
        name:req.body.name,
        lname: req.body.lname,
        email: req.body.email,
        contact: req.body.contact,
        password: hashedPassword
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch (err) {
        res.status(400).json({ msg: err.message })
    }
  })
  
// READING ONE USER
router.get('/', async (req,res) => {
    const queryUser = req.query.new
    try {
        const users = queryUser ? await User.find().sort({_id: -1}).limit(6) : await User.find();
        res.json(users)
    } catch (err) {
        res.status(500).json({ msg: err.message})
    }
    
})

// READING ONE USER
router.get('/:id', auth, async (req,res) => {
  const user = await User.findById(req.user[0]._id);
    res.send(user)
    
  })

// UPDATE USER
router.put('/:id', auth, async (req, res) => {
  const user = await User.findById(req.user[0]._id);
    if(req.body.fullname != null) user.fullname = req.body.fullname 
    if(req.body.email != null) user.email = req.body.email 
    if(req.body.password != null) user.password = req.body.password 
     

    try {
        const updatedUser = await user.save()
        res.json(updatedUser)
    }catch (err){
        res.status(400).json({ msg: err.message })
    }
})
  
// DELETE USER
router.delete('/:id', auth, async (req, res) => {
  const user = await User.findById(req.user[0]._id);
    try{
        await user.remove()
        res.json({ msg: '1 person deleted'})
    }catch (err) {
        res.status(500).json({ msg: err.message})
    }
})
  


 

  
  //  LOG IN USER
router.patch('/', async (req, res) => {
    const users = await User.find()
    const user = users.filter(user => user.email == req.body.email)
   
    console.log(user[0])
    const password = req.body.password
    let compared = await bcrypt.compare(password, user[0].password)
    if(compared) {
        console.log(compared)
        try {
            const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)
            console.log({msg: 'Token has been created'})
            res.json({ jwt: accessToken })
            console.log({msg: 'Successfully logged in!'})

        }catch (err) {
            res.status(500).send({ msg: err.message })
        }
    }  
  
  })

  // STARTING WITH CART ROUTES
  router.post("/:id/cart", [auth, getProduct], async (req, res, next) => {
    //  console.log(req.user)
  
    const user = await User.findById(req.user[0]._id);
    // console.log(user)
    let product_id = res.product._id;
    let title = res.product.title;
    let categories = res.product.categories;
    let img = res.product.img;
    let price = res.product.price;
    let created_by = req.user[0]._id;
    let quantity 
    if(req.body.quantity) quantity = await req.body.quantity 
    else quantity = await res.product.quantity 
    
    
  
    try {
      // console.log(Array.isArray(user.cart))
      // user.cart = []
      user.cart.push({
        product_id,
        title,
        categories,
        img,
        price,
        quantity,
        created_by,
      });
      const updatedUser = await user.save();
      res.status(201).json(updatedUser);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  });

// GET USER CART
router.get("/:id/cart", [auth, getProduct], (req,res) => {

})

//updates the items in the users cart
router.put("/:id/cart", [auth, getProduct], async (req, res, next) => {
    const user = await User.findById(req.user[0]._id);
    const inCart = user.cart.some(prod => prod.product_id == req.params.id);
    console.log(inCart)
    if (inCart) {
        const product = user.cart.find(prod => prod.product_id == req.params.id)
        product.quantity = req.body.quantity;
        const updatedUser = await user.save();
        console.log(updatedUser)
        try {
        res.status(201).json(updatedUser.cart);
        } catch (error) {
        res.status(500).json(console.log(error));
        }
      }
    // } else {
    //     try {
    //     // console.log(Array.isArray(user.cart))
    //     // user.cart = []
    //     let product_id = res.product._id;
    //     let title = res.product.title;
    //     let categories = res.product.categories;
    //     let img = res.product.img;
    //     let price = res.product.price;
    //     let quantity = req.body;
    //     let created_by = req.user._id;
    //     user.cart.push({
    //         product_id,
    //         title,
    //         categories,
    //         img,
    //         price,
    //         quantity,
    //         created_by,
    //     });
    //     const updatedUser = await user.save();
    //     res.status(201).json(updatedUser.cart);
    //     } catch (error) {
    //     res.status(500).json(console.log(error));
    //     }
    // }
});

  //clears the user cart
  router.delete("/:id/cart", [auth, getProduct], async (req, res, next) => {
    const user = await User.findById(req.user[0]._id);
    const inCart = user.cart.find(prod => prod.product_id == req.params.id);
    console.log(inCart)
    // function deleteBook(position) {
    //     let confirmation = confirm(
    //       `Are you sure you want to remove ${books[position].title.toUpperCase()} from the list?`
    //     );
      
    //     if (confirmation) {
    //       books.splice(position, 1);
    //       localStorage.setItem("Books", JSON.stringify(books));
    //       readBooks(books);
    //     }
    //   }
    user.remove(inCart)
    try{
        inCart.remove()
        res.json({ msg: '1 person deleted'})
    }catch (err) {
        res.status(500).json({ msg: err.message})
    }
   
  });
  module.exports = router;