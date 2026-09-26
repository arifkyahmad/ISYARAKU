addEventListener("click", () => {

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

document.querySelector(".login-btn").addEventListener("click", () => {

    const email = document.querySelector("input[type=email]").value;
    const pass = password.value;

    if(email === "" || pass === ""){
        alert("Mohon isi email dan kata sandi.");
        return;
    }

    alert("Login berhasil (dummy).");

});