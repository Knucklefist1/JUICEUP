const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

document.addEventListener("DOMContentLoaded", async () => {
    // Bestem om applikationen kører lokalt eller i produktion

    try {
        // Hent brugerprofilens data
        const response = await fetch(`${baseUrl}/profile`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Kunne ikke hente profildata.");
        }

        const data = await response.json();
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;
        document.getElementById("phoneNumber").textContent = data.phone_number;
        document.getElementById("createdAt").textContent = new Date(data.created_at).toLocaleString();
    } catch (error) {
        console.error("Fejl ved indlæsning af profil:", error);
    }
});

// Vis formular til redigering af email, når "Edit" knappen klikkes
document.getElementById("editEmailButton").addEventListener("click", () => {
    document.getElementById("editEmailForm").style.display = "block";
});

// Håndter indsendelse af formular til opdatering af email
document.getElementById("updateEmailForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newEmail = document.getElementById("newEmail").value;

    try {
        // Brug den allerede definerede `baseUrl`-variabel
        const response = await fetch(`${baseUrl}/profile/email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email: newEmail })
        });

        if (!response.ok) {
            throw new Error("Kunne ikke opdatere email.");
        }

        alert("Email opdateret med succes!");
        // Genindlæs profiloplysningerne for at vise ændringerne
        window.location.reload();
    } catch (error) {
        console.error("Fejl ved opdatering af email:", error);
    }
});

// Håndter indsendelse af formular til opdatering af kodeord
document.getElementById("updatePasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    // Valider, at det nye kodeord matcher bekræftelsen
    if (newPassword !== confirmNewPassword) {
        document.getElementById("passwordErrorMessage").textContent = "De nye kodeord stemmer ikke overens.";
        document.getElementById("passwordErrorMessage").style.display = "block";
        return;
    }

    try {
        // Brug den allerede definerede `baseUrl`-variabel
        const response = await fetch(`${baseUrl}/profile/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        document.getElementById("passwordUpdateMessage").textContent = "Kodeord opdateret med succes!";
        document.getElementById("passwordUpdateMessage").style.display = "block";
        document.getElementById("passwordErrorMessage").style.display = "none";
        document.getElementById("updatePasswordForm").reset(); // Ryd felterne i formularen
    } catch (error) {
        console.error("Fejl ved opdatering af kodeord:", error);
        document.getElementById("passwordErrorMessage").textContent = "Fejl: " + error.message;
        document.getElementById("passwordErrorMessage").style.display = "block";
    }
});
