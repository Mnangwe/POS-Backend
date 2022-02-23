const express = require('express');
const router = express.Router();
const Post = require('../models/posts')
const authenticateToken = require('../auth');


router.post('/', authenticateToken, async (req, res) => {
    let d = new Date();
    const user = req.user[0]
    console.log(user)
    const blog = new Post({
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
        date: d.toLocaleString(),
        user_id: user._id
    })
    try {
        const newBlog = await blog.save()
        res.status(201).json(newBlog)
    }catch (err) {
        res.status(400).json({ msg: err.message })
    }
})

// READING BLOGS
router.get('/', authenticateToken, async (req, res) => {
    try {
        const blogs = await Post.find();
        res.json(blogs)
    } catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// READING A BLOG
router.get('/:id', authenticateToken, getBlog, (req, res) => {
    try {
        res.send(res.blog)
    } catch(err) {
        res.status(403).json({ msg: err.message })
    }
    
})

// UPDATE A BLOG
router.put('/:id', authenticateToken, getBlog, async (req, res) => {
    let d = new Date()
    if(req.body.image != null) res.blog.image = req.body.image
    if(req.body.title != null) res.blog.title = req.body.title 
    if(req.body.body != null) res.blog.body = req.body.body 
    res.blog.date = d.toLocaleString()

    try {
        const updatedBlog = await res.blog.save()
        res.json(updatedBlog)
    }catch (err){
        res.status(400).json({ msg: err.message })
    }
})

// DELETE BLOG
router.delete('/:id', getBlog, async (req, res) => {
    try{
        await res.blog.remove()
        res.json({ msg: '1 person deleted'})
    }catch (err) {
        res.status(500).json({ msg: err.message})
    }
})

// MIDDLEWARE
async function getBlog(req, res, next) {
    let blog
    try {
      blog = await Post.findById(req.params.id)
      if(!blog) res.status(404).json({ msg: 'Cannot find blog'})
    }catch (err) {
      res.status(500).send({ msg: err.message })
    }

    res.blog = blog
    next()
}

module.exports = router;