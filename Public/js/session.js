document.addEventListener("DOMContentLoaded", () => {
    // Bestem om applikationen kører lokalt eller i produktion
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

    const authButton = document.getElementById("authButton");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const profileTab = document.getElementById("profileTab");
    const buttonContainer = document.getElementById("button-container"); // Tilføjet for dynamisk knapvisning

    // Funktion til at kontrollere sessionens status
    function checkSession() {
        fetch(`${baseUrl}/check-session`, {
            method: 'GET',
            credentials: 'include' // Sikrer, at cookies sendes med forespørgslen
        })
        .then(response => response.json())
        .then(data => {
            console.log("Session Data:", data); // Debugging: logger session data
            if (data.isLoggedIn) {
                // Hvis brugeren er logget ind
                if (authButton) {
                    authButton.textContent = "LOGOUT";
                    authButton.onclick = handleLogout;
                }

                // Viser brugerens fornavn, hvis det findes
                if (userNameDisplay && data.username) {
                    userNameDisplay.textContent = `Welcome, ${data.username}`;
                    userNameDisplay.style.fontWeight = "bold";
                    userNameDisplay.style.color = "#000";
                }

                // Sikrer, at "MY PROFILE"-fanen er synlig
                if (profileTab) {
                    profileTab.style.display = "inline"; // Gør fanen synlig
                }

                // Viser "Create Now"-knappen
                if (buttonContainer) {
                    buttonContainer.innerHTML = `
                        <button class="order-btn" onclick="window.location.href='createNow.html'">CREATE NOW</button>
                    `;
                }
            } else {
                // Hvis brugeren ikke er logget ind
                if (authButton) {
                    authButton.textContent = "LOGIN";
                    authButton.onclick = handleLogin;
                }
                if (userNameDisplay) {
                    userNameDisplay.textContent = ""; // Rydder visningen af brugernavn
                }

                // Skjuler "MY PROFILE"-fanen
                if (profileTab) {
                    profileTab.style.display = "none"; // Skjuler fanen
                }

                // Viser "Sign Up"-knappen
                if (buttonContainer) {
                    buttonContainer.innerHTML = `
                        <button class="order-btn" onclick="window.location.href='signup.html'">SIGN UP TO CREATE</button>
                    `;
                }
            }
        })
        .catch(err => {
            console.error('Fejl under kontrol af session:', err);

            // Viser som standard "Sign Up"-knappen ved fejl
            if (buttonContainer) {
                buttonContainer.innerHTML = `
                    <button class="order-btn" onclick="window.location.href='signup.html'">SIGN UP TO CREATE</button>
                `;
            }
        });
    }

    // Funktion til at håndtere logout
    function handleLogout() {
        fetch(`${baseUrl}/logout`, {
            method: 'POST',
            credentials: 'include' // Sikrer, at cookies sendes med forespørgslen
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                alert('Logout failed');
            }
        })
        .catch(err => {
            console.error('Fejl under logout:', err);
        });
    }

    // Funktion til at håndtere login (omdirigering til login-siden)
    function handleLogin() {
        window.location.href = 'login.html';
    }

    // Kontrollerer sessionen, når siden indlæses
    checkSession();
});

document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptCookiesButton = document.getElementById("accept-cookies");
  
    // Tjek om brugeren allerede har accepteret cookies
    if (localStorage.getItem("cookiesAccepted")) {
      cookieBanner.style.display = "none";
    }
  
    // Hvis brugeren klikker på "Accepter"
    acceptCookiesButton.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.style.display = "none";
    });
  });
  