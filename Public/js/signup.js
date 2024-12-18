document.addEventListener("DOMContentLoaded", () => {
    // Bestem om vi kører lokalt eller i produktion
    const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://www.joejuicecompetition.live';

    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Forhindre standard formularindsendelse

        // Hent inputværdier
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const acceptTerms = document.getElementById("acceptTerms").checked;

        // Valider felter
        if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
            document.getElementById("errorMessage").textContent = "All fields are required.";
            document.getElementById("errorMessage").style.display = "block";
            return;
        }

        if (password !== confirmPassword) {
            document.getElementById("errorMessage").textContent = "Passwords do not match.";
            document.getElementById("errorMessage").style.display = "block";
            return;
        }

        if (!acceptTerms) {
            document.getElementById("errorMessage").textContent = "You must accept the terms and conditions to sign up.";
            document.getElementById("errorMessage").style.display = "block";
            return;
        }

        // Opret et brugerobjekt til at sende til serveren
        const user = {
            username: `${firstName} ${lastName}`,
            email,
            phone_number: phoneNumber,
            password
        };

        // Send en POST-anmodning til serveren
        fetch(`${baseUrl}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include' // Ensures cookies are sent and received
        })
        .then(response => {
            if (response.ok) {
                document.getElementById("successMessage").style.display = "block";
                document.getElementById("errorMessage").style.display = "none";
                document.getElementById("signupForm").reset(); 
                setTimeout(() => {
                    window.location.href = "../juiceApp.html"; // Omdiriger til login-siden ved succes
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
});
