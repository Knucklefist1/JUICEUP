const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://164.92.247.82:3000';

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
        window.location.href = "../juiceApp.html";
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("errorMessage").style.display = "block";
    }
});
