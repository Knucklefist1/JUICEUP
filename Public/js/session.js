document.addEventListener("DOMContentLoaded", () => {
    // Determine if running locally or in production
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

    const authButton = document.getElementById("authButton");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const profileTab = document.getElementById("profileTab");

    // Function to check session status
    function checkSession() {
        fetch(`${baseUrl}/check-session`, {
            method: 'GET',
            credentials: 'include' // Ensure cookies are sent with the request
        })
        .then(response => response.json())
        .then(data => {
            console.log("Session Data:", data); // Debugging: log session data
            if (data.isLoggedIn) {
                // If user is logged in
                if (authButton) {
                    authButton.textContent = "LOGOUT";
                    authButton.onclick = handleLogout;
                }

                // Display user's first name if available
                if (userNameDisplay && data.username) {
                    userNameDisplay.textContent = `Welcome, ${data.username}`;
                    userNameDisplay.style.fontWeight = "bold";
                    userNameDisplay.style.color = "#000";
                }

                // Ensure "MY PROFILE" tab is visible
                if (profileTab) {
                    profileTab.style.display = "inline"; // Make sure it's visible
                }
            } else {
                // If user is not logged in
                if (authButton) {
                    authButton.textContent = "LOGIN";
                    authButton.onclick = handleLogin;
                }
                if (userNameDisplay) {
                    userNameDisplay.textContent = ""; // Clear username display
                }

                // Hide "MY PROFILE" tab
                if (profileTab) {
                    profileTab.style.display = "none"; // Hide profile tab
                }
            }
        })
        .catch(err => {
            console.error('Error checking session:', err);
        });
    }

    // Function to handle logout
    function handleLogout() {
        fetch(`${baseUrl}/logout`, {
            method: 'POST',
            credentials: 'include' // Ensure cookies are sent with request
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                alert('Logout failed');
            }
        })
        .catch(err => {
            console.error('Error during logout:', err);
        });
    }

    // Function to handle login (redirect to login page)
    function handleLogin() {
        window.location.href = 'login.html';
    }

    // Check the session on page load
    checkSession();
});
