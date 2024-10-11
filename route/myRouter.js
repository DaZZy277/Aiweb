//Routing
const express = require('express')
const router = express.Router()
const axios = require('axios')



//calling model
const {archiveModel,loginRegisterModel} = require('../models/model')
// const { render } = require('ejs')

// const path = require('path')

router.get(["/home","/"],(req,res) =>{
    res.render('mainpage',{username:req.cookies.username})

    // for(let cookieName in req.cookies){
    //     res.clearCookie(cookieName)
    // }
})


router.get("/index",(req,res) =>{
    res.render('index',{username:req.cookies.username})
    // console.log("555")
}) 

// router.get("/whatwedoai",(req,res) =>{
//     res.render('whatwedoai',{username:req.cookies.username})
//     // console.log("555")
// }) 


router.get("/whatwedowebapp",(req,res) =>{
    res.render('whatwedowebapp',{username:req.cookies.username})
    // console.log("555")
}) 

router.get("/team",(req,res) =>{
    res.render('team',{username:req.cookies.username})
    // console.log("555")
}) 

router.get("/member",(req,res) =>{
    res.render('member',{username:req.cookies.username})
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

    // function getData_option(){
    //     return data.option
    // }
    // global.GB_getData_option = getData_option
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
                inputMoney:req.body.money_input,
                option:req.body.option
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
        // console.log('hello im AI')
        async function getPrediction(n_years, initial_amount) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/predict',{
                    n_years: n_years,
                    initial_amount: initial_amount
                })
                // หลังจากรับ response สำเร็จ
                // ดึงข้อมูลของปีสุดท้ายจาก response.data
                const lastYearPrediction = response.data[response.data.length - 1]

                // ส่งข้อมูลปีสุดท้ายไปยังไฟล์ EJS
                res.render('prediction.ejs', { 
                    lastPrediction: lastYearPrediction,
                    inputMoney:req.body.money_input,
                    option:req.body.option
                });
                
            }catch(err){
                console.error('Error:', err)
                res.status(500).send('Error occurred')
            }
        }
        getPrediction(data.year_input, data.money_input); // เรียกใช้ฟังก์ชันเพื่อทำนายผล
        
    }
 
})



//result
router.post("/result2",(req,res) =>{

    const currentDate = new Date()

    //เช็คสถานะ login ของ user
    const loggedIn = req.cookies.username;
    if (loggedIn){
        let resultData = new archiveModel({
            re_username:req.cookies.username,
            re_inputMoney:req.body.re_inputMoney,
            re_percent:req.body.re_percent,
            re_resultYear:req.body.re_resultYear,
            re_checkbox:req.body.re_option,
            re_resultMoney:req.body.re_resultMoney,
            re_date:currentDate.toISOString().split('T')[0]
        })
        

        resultData.save().then(()=>{
        }).catch((err)=> console.log(err))

        res.redirect('/Archive')

    }else{

        //เก็บข้อมูลไว้ที่ session ก่อนที่ยังไม่มี username จาก cookie
        req.session.output = {
            re_inputMoney:req.body.re_inputMoney,
            re_percent:req.body.re_percent,
            re_resultYear:req.body.re_resultYear,
            re_checkbox:req.body.re_option,
            re_resultMoney:req.body.re_resultMoney,
            re_date:currentDate.toISOString().split('T')[0]
        }
            
        res.redirect('/login')
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
    if(req.session.output){
        let output = req.session.output;
        // บันทึกข้อมูลที่ดึงจาก session ลงใน database
        let resultData = new archiveModel({
            re_username:req.body.username,
            re_inputMoney:output.re_inputMoney,
            re_percent:output.re_percent,
            re_resultYear:output.re_resultYear,
            re_checkbox:output.re_checkbox,
            re_resultMoney:output.re_resultMoney,
            re_date:output.re_date
        })
        
        resultData.save().then(()=>{
            // ล้าง session เพื่อไม่ให้เก็บ output ไว้เกินจำเป็น
            req.session.output = null;
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

            //เมื่อ login แล้ว จะทำการบันทึกข้อมูลใน db archive
            if(req.session.output){
                let output = req.session.output;
                // บันทึกข้อมูลที่ดึงจาก session ลงใน database
                let resultData = new archiveModel({
                    re_username:doc.username,
                    re_inputMoney:output.re_inputMoney,
                    re_percent:output.re_percent,
                    re_resultYear:output.re_resultYear,
                    re_checkbox:output.re_checkbox,
                    re_resultMoney:output.re_resultMoney,
                    re_date:output.re_date
                })
                
                resultData.save().then(()=>{
                    // ล้าง session เพื่อไม่ให้เก็บ output ไว้เกินจำเป็น
                    req.session.output = null;
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
    
    const loggedIn = req.cookies.username;
     if (loggedIn){
         //เรียกข้อมูล จาก archivemodel ไปที่ หน้า archive 
        archiveModel.find({ re_username:req.cookies.username }).then(doc=>{
        res.render('archive.ejs', {
            saves: doc,
            username:req.cookies.username
        })
        // console.log(doc.username)
    }).catch((err)=>console.log(err))
     }else{
         res.redirect('/login')
     }

    
    
})


//delete archive data
router.post('/delete_archive',(req,res)=>{
    console.log(req.body._id)
    archiveModel.findOneAndDelete({ _id: req.body._id },{useFindAndModify:false}).then(()=>{

    res.redirect('/Archive')
    }).catch(err=>console.log(err))
})


//loout
router.get('/logout',(req,res)=>{
     // ลบคุกกี้ 'cookieName'
    //  console.log('Cookies before clearing:', req.cookies);

     // ลบคุกกี้ 'loggedIn' และ 'username'
     res.clearCookie('loggedIn')
     res.clearCookie('username')
     res.clearCookie('connect.sid')
   
     // Debug log คุกกี้หลังลบ
    //  console.log('Cookies after clearing:', req.cookies);
     req.session.destroy(err=>{
        if (err) {
            return res.status(500).send('Error occurred while clearing session');
        }
        res.redirect('/home')
    })
}) 

module.exports = router