const express = require('express')
const app = express()
const path = require('path')
const router = require('./route/myRouter')
const bodyParser = require('body-parser');

//ส่งมาแบบ post
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended:false}))

app.use(router)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))



app.listen(8080,()=>{
    console.log("Run Server at port 8080")
})
