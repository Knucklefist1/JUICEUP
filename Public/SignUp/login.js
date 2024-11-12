document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Retrieve the stored user data from sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    // Debugging: Log the stored user and entered credentials
    console.log("Stored user:", storedUser);
    console.log("Entered email:", email);
    console.log("Entered password:", password);

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert("Login successful!");
        // Redirect to home or dashboard page
        window.location.href = "../juiceApp.html";
    } else {
        // Display error message
        document.getElementById("errorMessage").style.display = "block";
    }
});
