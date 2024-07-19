const express = require('express')
const app = express()
const path = require('path')
const router = require('./route/myRouter')

app.use(router)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'static')))



app.listen(8080,()=>{
    console.log("Run Server at port 8080")
})
