//ใช้งาน mongoose
const mongoose = require('mongoose')

//เชื่อมไปยัง mongoose
const dbUrl = 'mongodb+srv://nonkung:Minecraft06@cluster0.p0minhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/archive'
mongoose.connect(dbUrl).then(()=>console.log('Connect to archive DB susccesfully!')).catch(err=>console.log(err))

//ออกแบบ schema
let archiveSchema = mongoose.Schema({
    money_input:Number,
    year_input:Number,
    checkbox:String,
    perccentage_input:Number
})


// สร้าง model
let archiveModel = mongoose.model("archiveCollection",archiveSchema)


// export model
module.exports = archiveModel