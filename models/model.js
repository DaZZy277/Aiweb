//ใช้งาน mongoose
const mongoose = require('mongoose')

//เชื่อมไปยัง mongoose
const dbUrl = 'mongodb+srv://nonkung:Minecraft06@cluster0.p0minhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbUrl).then(()=>console.log('Connect to archive DB susccesfully!')).catch(err=>console.log(err))

//ออกแบบ schema

    //schema of archive
let archiveSchema = mongoose.Schema({
    money_input:Number,
    year_input:Number,
    checkbox:String,
    perccentage_input:Number
})

    //schema of login & registor
let loginRegisterSchema = mongoose.Schema({
    email:String,
    username:String,
    password:String
})




// สร้าง model
let archiveModel = mongoose.model("archiveCollection",archiveSchema)
let loginRegisterModel = mongoose.model("loginRegisterCollection",loginRegisterSchema)

// export model

module.exports = {archiveModel,loginRegisterModel}


//function สำหรับ save ลง collection
