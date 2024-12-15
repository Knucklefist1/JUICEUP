document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    // Tilføjer en event listener til logout-knappen, hvis den findes
    logoutButton.addEventListener("click", logout);
  }
});

// Bestemmer om applikationen kører lokalt eller i produktion

function logout() {
  fetch(`${baseUrl}/logout`, {
    method: 'POST',
    credentials: 'include' // Sikrer, at sessionens cookie inkluderes
  })
  .then(response => {
    if (response.ok) {
      console.log("Logout-forespørgsel gennemført"); // Logger succesfuld logout
      window.location.href = '/login.html'; // Omdirigerer til login-siden efter logout
    } else {
      console.error("Logout mislykkedes");
    }
  })
  .catch(error => {
    console.error("Fejl under logout:", error); // Logger fejl, hvis noget går galt
  });
}
