document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch the user profile data
        const response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        document.getElementById("firstName").textContent = data.first_name;
        document.getElementById("lastName").textContent = data.last_name;
        document.getElementById("email").textContent = data.email;
        document.getElementById("phoneNumber").textContent = data.phone_number;
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
        const response = await fetch("http://localhost:3000/profile/email", {
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
