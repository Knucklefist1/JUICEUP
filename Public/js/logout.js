document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

// Determine if running locally or in production

function logout() {
  fetch(`${baseUrl}/logout`, {
    method: 'POST',
    credentials: 'include' // Ensures the session cookie is included
  })
  .then(response => {
    if (response.ok) {
      console.log("Logout request successful");
      window.location.href = '/login.html'; // Redirect to login page after successful logout
    } else {
      console.error("Failed to log out");
    }
  })
  .catch(error => {
    console.error("Error during logout:", error);
  });
}
