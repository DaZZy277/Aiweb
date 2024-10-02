//Routing
const express = require('express')
const router = express.Router()




//calling model
const {archiveModel,loginRegisterModel} = require('../models/model')
const { render } = require('ejs')

// const path = require('path')

router.get("/home",(req,res) =>{
    res.render('mainpage')
})

router.get("/user",(req,res) =>{
    res.render('User')
    // console.log("555")
}) 





router.get("/navbar",(req,res) =>{
    res.render('navbar')
    // console.log("555")
}) 

router.post('/result',(req,res)=>{


    let data = {
            money_input:req.body.money_input,
            option:req.body.option,
            year_input:req.body.Year_input,
            Percentage_input_Manual:req.body.Percentage_input_Manual
        }
    
    console.log(data.option)

    function getData_option(){
        return data.option
    }
    global.GB_getData_option = getData_option
    // console.log(data.money_input+100)

    //คำนวนเงินเฟ้อแบบ manual

    if(data.option==='Manual'){

    // console.log(output.resultMoney)

    //ส่งข้อมูล object ไปที่ result.ejs
        
            // เปลี่ยนอัตราเงินเฟ้อประจำปีจากเปอร์เซ็นต์เป็นทศนิยม
            let inflationRate = data.Percentage_input_Manual / 100;
            
                
            // คำนวณค่าในอนาคต
            let futureValue = data.money_input * Math.pow(1 + inflationRate, data.year_input);
            futureValue = parseFloat(futureValue.toFixed(2)) ;
            
            console.log(futureValue);
            console.log(data.year_input);
            

        let output = [
            {
                resultMoney:futureValue,
                resultPercentage:req.body.Percentage_input_Manual,
                resultYear:req.body.Year_input,
                inputMoney:req.body.money_input
            }
        ]

        console.log(output[0].resultMoney)
        console.log(output[0].resultYear)

        //ส่งข้อมูล object ไปที่ result.ejs
        
        res.render('result.ejs',{
            output:output

        })
        // res.redirect('mainpage')

    }else if(data.option==='Ai'){
        console.log('hello im AI')
        
    }
 
})

//Login
router.post("/login",(req,res) =>{

    const currentDate = new Date()

    //save หน้า result ลง archive collection database
    let resultData = new archiveModel({
        re_inputMoney:req.body.re_inputMoney,
        re_resultYear:req.body.re_resultYear,
        re_checkbox:GB_getData_option(),
        re_resultMoney:req.body.re_resultMoney,
        re_date:currentDate.toISOString().split('T')[0]
    })

    resultData.save().then(()=>{
    }).catch((err)=> console.log(err))



    //เช็คสถานะ login ของ user
    const loggedIn = req.cookies.username;
    if (loggedIn){
        res.redirect('/Archive')
    }else{
        res.render('login')
    }
    
}) 

//checkRegister
router.post("/checkRegister",(req,res)=>{

    
    //object เก็บข้อมูล register
    let registerData = new loginRegisterModel({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    })
    // let number = [{
    //     num1:1,
    //     num2:2
    // }]
    console.log(req.body.email)

    //save สถานะ login ด้วย cookie
    res.cookie('loggedIn','true',{maxAge:3600000,httpOnly:true})
    res.cookie('username', req.body.username, { maxAge: 3600000, httpOnly: true })

    //save regier data ลงใน loginregister collection DB
    registerData.save().then(()=>{
        res.redirect('/Archive')
        // res.render('archive',{
        //     number:number
        // })
    }).catch((err)=> console.log(err))

      
})

router.post("/checkLogin",(req,res)=>{

    //check email ว่าเป็นของใคร?

    loginRegisterModel.findOne({ email: req.body.email, password: req.body.password }).then((doc)=>{
        if (doc) {
            //save สถานะ login ด้วย cookie
            res.cookie('loggedIn','true',{maxAge:3600000,httpOnly:true})
            res.cookie('username', doc.username, { maxAge: 3600000, httpOnly: true })
            // console.log(doc.username)
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
    

    //เรียกข้อมูล จาก archivemodel ไปที่ หน้า archive 
    archiveModel.find().then(doc=>{
        res.render('archive.ejs', {saves: doc})
    }).catch((err)=>console.log(err))

    
})

// 
module.exports = router