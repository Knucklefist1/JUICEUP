document.addEventListener("DOMContentLoaded", async () => {
    // Determine if running locally or in production
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://joejuicecompetition.live';

    try {
        // Fetch the user profile data
        const response = await fetch(`${baseUrl}/profile`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;
        document.getElementById("phoneNumber").textContent = data.phone_number;
        document.getElementById("createdAt").textContent = new Date(data.created_at).toLocaleString();
    } catch (error) {
        console.error("Error loading profile:", error);
    }
});

// Show email edit form when clicking "Edit"
document.getElementById("editEmailButton").addEventListener("click", () => {
    document.getElementById("editEmailForm").style.display = "block";
});

// Handle email update form submission
document.getElementById("updateEmailForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newEmail = document.getElementById("newEmail").value;

    try {
        // Use the already defined `baseUrl` variable
        const response = await fetch(`${baseUrl}/profile/email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email: newEmail })
        });

        if (!response.ok) {
            throw new Error("Failed to update email.");
        }

        alert("Email updated successfully!");
        // Reload the profile information to reflect the changes
        window.location.reload();
    } catch (error) {
        console.error("Error updating email:", error);
    }
});

// Handle password update form submission
document.getElementById("updatePasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    // Validate that the new password matches the confirmation
    if (newPassword !== confirmNewPassword) {
        document.getElementById("passwordErrorMessage").textContent = "New passwords do not match.";
        document.getElementById("passwordErrorMessage").style.display = "block";
        return;
    }

    try {
        // Use the already defined `baseUrl` variable
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

        document.getElementById("passwordUpdateMessage").textContent = "Password updated successfully!";
        document.getElementById("passwordUpdateMessage").style.display = "block";
        document.getElementById("passwordErrorMessage").style.display = "none";
        document.getElementById("updatePasswordForm").reset(); // Clear the form fields
    } catch (error) {
        console.error("Error updating password:", error);
        document.getElementById("passwordErrorMessage").textContent = "Error: " + error.message;
        document.getElementById("passwordErrorMessage").style.display = "block";
    }
});
