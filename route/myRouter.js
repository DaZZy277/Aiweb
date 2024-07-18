//Routing
const express = require('express')
const router = express.Router()
// const path = require('path')

router.get("/home",(req,res) =>{
    res.render('mainpage')
})

router.get("/user",(req,res) =>{
    res.render('User')
}) 



module.exports = router