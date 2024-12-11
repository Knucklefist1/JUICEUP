document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';
    const profileTab = document.getElementById("profileTab"); // Select the "MY PROFILE" tab
    const authButton = document.getElementById("authButton");

    // Function to check session status
    function checkSession() {
        fetch(`${baseUrl}/check-session`, {
            method: "GET",
            credentials: "include", // Include cookies for session
        })
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                // User is logged in
                profileTab.style.display = "inline"; // Show the "MY PROFILE" tab
                authButton.textContent = "LOGOUT";
                authButton.onclick = handleLogout;
            } else {
                // User is not logged in
                profileTab.style.display = "none"; // Hide the "MY PROFILE" tab
                authButton.textContent = "LOGIN";
                authButton.onclick = handleLogin;
            }
        })
        .catch(err => {
            console.error("Error checking session:", err);
        });
    }

    // Function to handle logout
    function handleLogout() {
        fetch(`${baseUrl}/logout`, {
            method: "POST",
            credentials: "include",
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "login.html";
            } else {
                alert("Logout failed.");
            }
        })
        .catch(err => {
            console.error("Error during logout:", err);
        });
    }

    // Function to handle login
    function handleLogin() {
        window.location.href = "login.html";
    }

    // Check the session on page load
    checkSession();
});
