const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const googleBtn = document.getElementById("googleBtn");

toggle.addEventListener("click", () => {

    if(password.type === "password"){
        password.type = "text";
        eyeIcon.src = "../assets/img/view.png";
        eyeIcon.alt = "Hide Password";
    }else{
        password.type = "password";
        eyeIcon.src = "../assets/img/hide.png";
        eyeIcon.alt = "Show Password";
    }

});

googleBtn.addEventListener("click", async () => {

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/frontend/pages/../index.html"
        }
    });

    if(error) alert(error.message);

});

document.querySelector(".login-btn").addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const pass = password.value;

    if(email === "" || pass === ""){
        alert("Mohon isi email dan kata sandi.");
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password: pass
    });

    if(error){
        alert(error.message);
    }else{
        alert("Login berhasil!");
    }

});