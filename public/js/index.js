// Variable Declaration

const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

// Login button function

loginBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "#feb729";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    loginBtn.style.color = "black"
    registerBtn.style.color = "white"
    loginForm.style.left = "50%";
    registerForm.style.left = "-50%"

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;

    document.querySelector(".col-1").style.borderRadius = "0 25% 20% 0";
})


// Register button function

registerBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.backgroundColor = "#feb729";
    registerBtn.style.color = "black"
    loginBtn.style.color = "white"
    loginForm.style.left = "150%";
    registerForm.style.left = "50%"

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;

    document.querySelector(".col-1").style.borderRadius = "0 20% 25% 0";

})

const myModal = document.getElementById('staticBackdrop')
const myInput = document.getElementById('delbtn')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})