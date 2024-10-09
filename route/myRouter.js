//Routing
const express = require('express')
const router = express.Router()




//calling model
const {archiveModel,loginRegisterModel} = require('../models/model')
// const { render } = require('ejs')

// const path = require('path')

router.get("/home",(req,res) =>{
    res.render('mainpage')
    // for(let cookieName in req.cookies){
    //     res.clearCookie(cookieName)
    // }
})

router.get("/user",(req,res) =>{
    res.render('User')
    // console.log("555")
}) 





router.get("/index",(req,res) =>{
    res.render('index')
    // console.log("555")
}) 

router.get("/whatwedoai",(req,res) =>{
    res.render('whatwedoai')
    // console.log("555")
}) 


router.get("/whatwedowebapp",(req,res) =>{
    res.render('whatwedowebapp')
    // console.log("555")
}) 

router.get("/team",(req,res) =>{
    res.render('team')
    // console.log("555")
}) 

router.get("/member",(req,res) =>{
    res.render('member')
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

    }else if(data.option==='AiPredict'){
        console.log('hello im AI')
        
    }
 
})



//result
router.post("/result2",(req,res) =>{

    //เก็บข้อมูลไว้ซักที่ก่อนที่ยังไม่มี username จาก cookie

    const currentDate = new Date()
    let resultData = new archiveModel({
        // re_username:req.cookies.username,
        re_inputMoney:req.body.re_inputMoney,
        re_percent:req.body.re_percent,
        re_resultYear:req.body.re_resultYear,
        re_checkbox:GB_getData_option(),
        re_resultMoney:req.body.re_resultMoney,
        re_date:currentDate.toISOString().split('T')[0]
    })

    global.globalresultData = resultData;

    //เช็คสถานะ login ของ user
    const loggedIn = req.cookies.username;
    if (loggedIn){
        resultData.re_username = req.cookies.username

        resultData.save().then(()=>{
            delete resultData.re_username
        }).catch((err)=> console.log(err))

        res.redirect('/Archive')
    }else{
        res.render('login.ejs')
    }

}) 

router.get("/login",(req,res) =>{
    
     //เช็คสถานะ login ของ user
     const loggedIn = req.cookies.username;
     if (loggedIn){
         res.redirect('/Archive')
     }else{
         res.render('login.ejs')
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
    }).catch((err)=> console.log(err))

    //เมื่อ register แล้ว จะทำการบันทึกข้อมูลใน db archive
    if(globalresultData){
        globalresultData.re_username = req.cookies.username
    globalresultData.save().then(()=>{
        delete globalresultData.re_username
    }).catch((err)=> console.log(err))
    }else{
        console.log('err')
    }
    

    res.redirect('/Archive')

      
})

router.post("/checkLogin",(req,res)=>{

    //check email ว่าเป็นของใคร?

    loginRegisterModel.findOne({ email: req.body.email, password: req.body.password }).then((doc)=>{
        if (doc) {
            //save สถานะ login ด้วย cookie
            res.cookie('loggedIn','true',{maxAge:3600000,httpOnly:true})
            res.cookie('username', doc.username, { maxAge: 3600000, httpOnly: true })
            // console.log(doc.username)

        if(globalresultData){
            //เมื่อ login แล้ว จะทำการบันทึกข้อมูลใน db archive
            globalresultData.re_username = req.cookies.username
            globalresultData.save().then(()=>{
                delete globalresultData.re_username
            }).catch((err)=> console.log(err))

        }else{
            console.log('err')
        }
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
    archiveModel.find({ re_username:req.cookies.username }).then(doc=>{
        res.render('archive.ejs', {saves: doc})
    }).catch((err)=>console.log(err))

    const userdis = req.cookies.username;
    const Helement =document.getElementById("user_display");
    Helement.innerHTML = "Welcome" + userdis ;
    
})

// 
module.exports = router