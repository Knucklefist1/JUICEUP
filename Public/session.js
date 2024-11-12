// Check if a user is logged in and display their name if so
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.loggedIn) {
        const userNameDisplay = document.getElementById("userNameDisplay");
        if (userNameDisplay) {
            userNameDisplay.textContent = `Welcome, ${user.firstName}`;
            userNameDisplay.style.fontWeight = "bold";
            userNameDisplay.style.color = "#000";
        }
    }
}

// Logout function to clear session and redirect to signup/login page
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/Src/Public/SignUp/signup.html";
}

// Call checkLoginStatus on every page load
document.addEventListener("DOMContentLoaded", checkLoginStatus);
