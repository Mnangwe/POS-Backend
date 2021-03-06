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
        fullname: req.body.fullname,
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
  console.log("hey there")
  console.log(req.user[0])
  const user = await User.findById(req.user[0]._id);
  console.log(user)
    res.send(user)
    
  })

// UPDATE USER
// router.put('/', auth, async (req, res) => {
//   const user = await User.findById(req.user[0]._id);
//     if(req.body.fullname != null) user.fullname = req.body.fullname 
//     if(req.body.email != null) user.email = req.body.email 
//     if(req.body.contact != null) user.fullname = req.body.fullname 
//     if(req.body.image != null) user.email = req.body.email 
//     if(req.body.cover != null) user.password = req.body.password 
//     let password = req.body.password
//     if (password) {
//       const salt = await bcrypt.genSalt();
//       const hashedPassword = await bcrypt.hash(password, salt);
//       user.password = hashedPassword;
//     }
   
  
//     try {
//       const updatedUser = await user.save();
  
//       try {
//         const access_token = jwt.sign(
//           JSON.stringify(updatedUser),
//           process.env.ACCESS_TOKEN_SECRET
//         );
//         res.status(201).json({ jwt: access_token, user: updatedUser });
//       } catch (error) {
//         res.status(500).json({ message: error.message });
//       }
//       // Dont just send user as object, create a JWT and send that too.
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
// })

router.put('/:id', auth, async (req, res, next)=>{
  // Get user from DB using Schema
  const user = await User.findById(req.user[0]._id)

  // Get info needed to update user
  const { fullname, contact, password, cover, image, about } = req.body;

  // Set information
  if (fullname) user.fullname = fullname;
  if (contact) user.contact = contact;
  if (cover) user.cover = cover;
  if (image) user.image = image;
  if (about) user.about = about;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
 

  try {
    const updatedUser = await user.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(updatedUser),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: access_token, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Dont just send user as object, create a JWT and send that too.
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  try{
    const users = await User.find()
    const user = users.filter(user => user.email == req.body.email)
    // console.log(user)
    if(!user || user == null) res.status(401).json({msg: "Wrong credentials"})
    
    const password = req.body.password
    let compared = await bcrypt.compare(password, user[0].password)
    if(!password || password == null) res.status(401).json({msg: "Wrong credentials"});
    else if(compared) {
      console.log(compared)
        
      const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)
      console.log({msg: 'Token has been created'})
      res.status(200).json({ jwt: accessToken })
      console.log({msg: 'Successfully logged in!'})
      
        
      }
  }catch(err){
    res.status(500).json({msg: err.message})
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
      if(updatedUser) {
        console.log(updatedUser)
        try {
            const accessToken = jwt.sign(JSON.stringify(updatedUser), process.env.ACCESS_TOKEN_SECRET)
            console.log({msg: 'Token has been created'})
            res.json({ jwt: accessToken })
            console.log({msg: 'Successfully added to your cart!'})

        }catch (err) {
            res.status(500).send({ msg: err.message })
        }
    }  
  
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
    const inCart = user.cart.some(prod => prod.product_id == req.params.id);
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