document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Fetch input values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phone").value;  // New field for phone number
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate passwords
    if (password !== confirmPassword) {
        document.getElementById("errorMessage").textContent = "Passwords do not match.";
        document.getElementById("errorMessage").style.display = "block";
        return;
    }

    // Create a user object to send to the server
    const user = {
        username: `${firstName} ${lastName}`, // Combine first and last name as username
        email,
        phone_number: phoneNumber,  // Add phone number to the user object
        password
    };

    // Send a POST request to the server
    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("successMessage").style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("signupForm").reset(); // Clear the form fields

            // Redirect to homepage after a delay
            setTimeout(() => {
                window.location.href = "../juiceApp.html";
            }, 2000);
        } else {
            return response.text().then(error => {
                throw new Error(error);
            });
        }
    })
    .catch(error => {
        console.error("Error during sign-up:", error);
        document.getElementById("errorMessage").textContent = "Error: " + error.message;
        document.getElementById("errorMessage").style.display = "block";
    });
});
