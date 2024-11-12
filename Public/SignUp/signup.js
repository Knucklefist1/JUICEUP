document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Forhindr standard formular-indsendelse

    // Hent inputværdier
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Valider passwords
    if (password !== confirmPassword) {
        document.getElementById("errorMessage").textContent = "Passwords do not match.";
        document.getElementById("errorMessage").style.display = "block";
        return;
    }

    // Opret et brugerobjekt til at sende til serveren
    const user = {
        username: `${firstName} ${lastName}`, // Kombiner fornavn og efternavn som brugernavn
        email,
        password
    };

    // Send en POST-anmodning til serveren
    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("successMessage").style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("signupForm").reset(); // Ryd formularfelterne

            // Omdiriger til startside efter en forsinkelse
            setTimeout(() => {
                window.location.href = "../juiceApp.html";
            }, 2000);
        } else {
            return response.text().then(error => {
                throw new Error(error);
            });
        }
    })
    .catch(error => {
        console.error("Error during sign-up:", error);
        document.getElementById("errorMessage").textContent = "Error: " + error.message;
        document.getElementById("errorMessage").style.display = "block";
    });
});
