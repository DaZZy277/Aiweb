//Routing
const express = require('express')
const router = express.Router()



//calling model
const {archiveModel,loginRegisterModel} = require('../models/model')

// const path = require('path')

router.get("/",(req,res) =>{
    res.render('mainpage')
})

router.get("/user",(req,res) =>{
    res.render('User')
    // console.log("555")
}) 

router.get("/login",(req,res) =>{
    res.render('login')
    // console.log("555")
}) 

router.get("/archive",(req,res) =>{
    res.render('archive')
    // console.log("555")
}) 

router.post('/result',(req,res)=>{

    let data = {
            money_input:req.body.money_input,
            AiPredict:req.body.AiPredict,
            Manual:req.body.Manual,
            year_input:req.body.year_input,
            Percentage_input_Manual:req.body.Percentage_input_Manual
        }
    
    // console.log(data.money_input+100)

    //คำนวนเงินเฟ้อแบบ manual

    if(data.Manual){

    

    // console.log(output.resultMoney)

    //ส่งข้อมูล object ไปที่ result.ejs
        
            // เปลี่ยนอัตราเงินเฟ้อประจำปีจากเปอร์เซ็นต์เป็นทศนิยม
            let inflationRate = data.Percentage_input_Manual / 100;
            
                
            // คำนวณค่าในอนาคต
            let futureValue = data.money_input * Math.pow(1 + inflationRate, 3);
            futureValue = parseFloat(futureValue.toFixed(2)) ;
            console.log(futureValue);

        let output = [
            {
                resultMoney:futureValue,
                resultPercentage:req.body.Percentage_input_Manual,
                resultYear:req.body.year_input,
                inputMoney:req.body.money_input
            }
        ]

        console.log(output[0].resultMoney)

        //ส่งข้อมูล object ไปที่ result.ejs
        
        res.render('result.ejs',{
            output:output

        })
        // res.redirect('mainpage')

    }else if(data.AiPredict){
        res.render('ai')
    }

    


    
})

//Login
router.post("/login",(req,res) =>{
    res.render('login')
    
}) 

//checkRegister
router.post("/checkRegister",(req,res)=>{

    
    //object เก็บข้อมูล register
    let registerData = new loginRegisterModel({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    })

    //save regier data ลงใน DB
    registerData.save().then(()=>{
        res.render('User.ejs') 
    }).catch((err)=> console.log(err))

      
})

router.post("/checkLogin",(req,res)=>{

    loginRegisterModel.findOne({ email: req.body.email, password: req.body.password }).then((doc)=>{
        if (doc) {
            // console.log('ถูก')
            res.redirect('/Archive')
        } else {
            let invalid = [
                {
                    email:req.body.email,
                    password:req.body.password
                }
            ]
            res.render('invalid.ejs',{invalid:invalid})
        }
    }).catch((err)=>console.log(err))
    
      
})


// for Archive Page

router.get("/Archive",(req,res) =>{
    res.render('Archive.ejs')
    
})

// 
module.exports = router