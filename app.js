const express = require('express')
const app = express()
const path = require('path')
const router = require('./route/myRouter')
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const axios = require('axios');

app.use(session({
    secret:"mysession",
    resave:false,
    saveUninitialized:false
}))



//ส่งมาแบบ post
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended:false}))

app.use(cookieParser('cookie-praser'));

app.use(router)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))


app.use(favicon(__dirname + '/public/img/official_logo.png'));

app.listen(8000,()=>{
    console.log("Run Server at port 8000 ")
})
