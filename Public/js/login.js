// Bestemmer om applikationen kører lokalt eller i produktion
const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Forhindrer standardformularens indsendelsesadfærd

    const email = document.getElementById("email").value; // Henter email-indtastning
    const password = document.getElementById("password").value; // Henter kodeord-indtastning

    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Indstiller headers for JSON-data
            },
            body: JSON.stringify({ email, password }), // Sender email og kodeord som JSON
            credentials: "include" // Inkluderer sessionens cookie
        });

        if (!response.ok) {
            throw new Error("Login mislykkedes"); // Kaster fejl, hvis login fejler
        }

        alert("Login gennemført!");
        window.location.href = "/juiceApp.html"; // Omdirigerer til juice-app-siden efter succesfuldt login
    } catch (error) {
        console.error("Fejl under login:", error); // Logger fejl, hvis noget går galt
        document.getElementById("errorMessage").style.display = "block"; // Viser fejlmeddelelse til brugeren
    }
});
