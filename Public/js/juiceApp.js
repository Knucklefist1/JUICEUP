// Function to display the logged-in user's name
function displayUserName() {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage
    if (user && user.loggedIn) {
        // If user is logged in, display their first name
        const userNameDisplay = document.getElementById("userNameDisplay");
        userNameDisplay.textContent = `Welcome, ${user.username}`;
        userNameDisplay.style.fontWeight = "bold";
    }
}

// Call displayUserName on page load
document.addEventListener("DOMContentLoaded", displayUserName);
