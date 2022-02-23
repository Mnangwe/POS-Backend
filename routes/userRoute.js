const express = require('express');
const router = express.Router();
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 


// CREATING A USER
router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
    const user = new User({
        name: req.body.name,
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
    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.status(500).json({ msg: err.message})
    }
    
})

// READING ONE USER
router.get('/:id', getUser, (req,res) => {
    
    res.send(res.user)
    
  })

// UPDATE USER
router.put('/:id', getUser, async (req, res) => {
    if(req.body.name != null) res.user.name = req.body.name 
    if(req.body.email != null) res.user.email = req.body.email 
    if(req.body.password != null) res.user.password = req.body.password 
    if(req.body.contact != null) res.user.contact = req.body.contact 

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    }catch (err){
        res.status(400).json({ msg: err.message })
    }
})
  
// DELETE USER
router.delete('/:id', getUser, async (req, res) => {
    try{
        await res.user.remove()
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
    let compared = await bcrypt.compare(req.body.password, user[0].password)
    if(compared) {
        console.log(compared)
        try {
            const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)
            console.log({msg: 'Token has been created'})
            res.json({ jwt: accessToken })
            console.log({msg: 'Successfully logged in!'})

        }catch {
            res.status(500).send()
        }
    }
    // res.send(user[0])
    // const users = await User.findOne()
    // // console.log(users)
   // console.log("the users: "+user)
    // if (user == null) {
    //     res.status(400).send('Cannot find user')
    // }else{
    //     try {
    //         // 
    //         // console.log(compared)
    //         console.log(user)
    //         console.log(await bcrypt.compare(user.password, req.body.password))
    //         if(await bcrypt.compare(req.body.password, user.password)) {
    //             res.send({msg: 'Successfully logged in!'})
    //         }else {
    //             res.send({msg: 'User not found'})
    //         }
    //     }catch (err) {
    //         res.status(500).json({ msg: err.message})
    //     }
    // }
    
    // const { email, password } = req.body;
    // let sql = `SELECT * FROM users where user_email = '${email}'`;
    
  
    // RUN THE QUERY 
  
      
    //   con.query(sql, async (err, result) => {
    //     const user = result[0]
        
    //     let compared = await bcrypt.compare(password, user.user_password)
    //     console.log(compared)
    //     if(compared){
    //       console.log(user)
    //       try {
    //         const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)
    //         console.log({msg: 'Token has been created'})
    //         res.json({ jwt: accessToken })
    //         console.log({msg: 'Successfully logged in!'})
    //       }catch {
    //         res.status(500).send()
    //     }
        
        
    //   }
    // })
  
  })

  // MIDDLEWARE
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
  
  module.exports = router;