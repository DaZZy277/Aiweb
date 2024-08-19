// ฟังก์ชันคำนวณเงินเฟ้อในอนาคต
function calculateFutureValue(principal, annualInflationRate, years) {
    // เปลี่ยนอัตราเงินเฟ้อประจำปีจากเปอร์เซ็นต์เป็นทศนิยม
    let inflationRate = annualInflationRate / 100;
    
    // คำนวณค่าในอนาคต
    let futureValue = principal * Math.pow(1 + inflationRate, years);
    
    return futureValue;
}

// ตัวอย่างการใช้งานฟังก์ชัน
let principal = 1000; // เงินต้น
let annualInflationRate = 3; // อัตราเงินเฟ้อประจำปีเป็นเปอร์เซ็นต์
let years = 5; // จำนวนปีในอนาคต

let futureValue = calculateFutureValue(principal, annualInflationRate, years);
console.log(`ค่าในอนาคตของเงินต้นที่ ${principal} บาท หลังจาก ${years} ปี ที่อัตราเงินเฟ้อประจำปี ${annualInflationRate}% คือ ${futureValue.toFixed(2)} บาท`);
