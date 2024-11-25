// Determine if running locally or in production
const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        alert("Login successful!");
        window.location.href = "/juiceApp.html";
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("errorMessage").style.display = "block";
    }
});
