document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login").addEventListener("click", e => {
        //e.preventDefault();

        const mail = document.getElementById("inputEmail").value;
        const pass = document.getElementById("inputPassword").value;
        const rember = document.getElementById("inputCheck").checked;

        const session = {
            'mail': mail,
            'pass': pass
        };

        if (mail.length > 0 && pass.length > 0) {
            try {
                localStorage.setItem("user", JSON.stringify(session));
            } catch (e) {
            }
            location.href = "./index.html";
        } else {
            Swal.fire("Error!", "Verifique email y contraseña\n(no pueden ser vacios)", "error");
        }
    });
});

//guardar email del usuario en localStorage
function guardarDato() {
    const email = document.getElementById("inputEmail").value;
    localStorage.setItem("email", email);
}