//Routing
const express = require('express')
const router = express.Router()
const archiveModel = require('../models/modelArchive')
// const path = require('path')

router.get("/home",(req,res) =>{
    res.render('mainpage')
})

router.get("/user",(req,res) =>{
    res.render('User')
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
    
    // console.log(data.Manual)

    //คำนวนเงินเฟ้อแบบ manual
    if(data.Manual){
        
            // เปลี่ยนอัตราเงินเฟ้อประจำปีจากเปอร์เซ็นต์เป็นทศนิยม
            const inflationRate = data.Percentage_input_Manual / 100;
            
                
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

    }

    


    
})


module.exports = router