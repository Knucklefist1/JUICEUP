document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Ensure cookies (session) are included in requests
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        alert("Login successful!");
        window.location.href = "../juiceApp.html"; // Redirect to the juice app page
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("errorMessage").style.display = "block";
    }
});
