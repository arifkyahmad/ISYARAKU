const eyeIcon = document.getElementById("eyeIcon");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const message = document.getElementById("passwordMessage");
const registerBtn = document.getElementById("registerBtn");
const toggle = document.getElementById("togglePassword");
const confirmEyeIcon = document.getElementById("confirmEyeIcon");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const agreeTerms = document.getElementById("agreeTerms");


toggle.addEventListener("click", () => {

    if(password.type === "password"){
        password.type = "text";
        eyeIcon.src = "../assets/img/view.png"
        eyeIcon.alt = "Hide Password"
    }else{
        password.type = "password";
        eyeIcon.src = "../assets/img/hide.png"
        eyeIcon.alt = "Show Password"
    }

});

toggleConfirmPassword.addEventListener("click", () => {

    if(confirmPassword.type === "password"){
        confirmPassword.type = "text";
        confirmEyeIcon.src = "../assets/img/view.png";
        confirmEyeIcon.alt = "Hide Password";
    }else{
        confirmPassword.type = "password";
        confirmEyeIcon.src = "../assets/img/hide.png";
        confirmEyeIcon.alt = "Show Password";
    }

});


function validatePassword(){

    if(confirmPassword.value === ""){
        message.textContent = "";
        return false;
    }

    if(password.value === confirmPassword.value){
        message.textContent = " Kata sandi cocok";
        message.classList.add("success");
        return true;
    }else{
        message.textContent = " Kata sandi tidak sama";
        message.classList.remove("success");
        return false;
    }

}

password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

registerBtn.addEventListener("click", () => {

    const name = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;

    if(name === "" || email === "" || password.value === "" || confirmPassword.value === ""){
        alert("Semua field wajib diisi.");
        return;
    }

    if(!validatePassword()){
        alert("Konfirmasi kata sandi belum sesuai.");
        return;
    }

    if(!agreeTerms.checked){
        alert("Kamu harus menyetujui Ketentuan Layanan & Kebijakan Privasi terlebih dahulu.");
        return;
    }

    alert("Registrasi berhasil!");

});
