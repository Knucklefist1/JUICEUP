// Generic function to set a cookie with expiration days
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}

// Generic function to get a cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split("; ");
    for (let cookie of cookiesArray) {
        if (cookie.startsWith(nameEQ)) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

// Show the cookie consent popup if not already accepted or declined
function checkCookieConsent() {
    const consent = getCookie("cookieConsent");
    if (!consent) {
        document.getElementById("cookieConsent").style.display = "block";
    }
}

// Accept cookies
function acceptCookies() {
    setCookie("cookieConsent", "accepted", 365);
    document.getElementById("cookieConsent").style.display = "none";
}

// Decline cookies
function declineCookies() {
    setCookie("cookieConsent", "declined", 365);
    document.getElementById("cookieConsent").style.display = "none";
}

// Check cookie consent status on page load
window
