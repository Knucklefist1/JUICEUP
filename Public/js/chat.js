function openChat() {
    document.getElementById("chatModal").style.display = "flex";
}

function closeChat() {
    document.getElementById("chatModal").style.display = "none";
}

function acceptPrivacyTerms() {
    alert("Thank you for accepting the privacy terms. You are now eligible to enter the competition!");
}

function sendQuestion(question) {
    const chatBox = document.getElementById("chatBox");
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = question;
    chatBox.appendChild(userMessage);

    const botResponse = document.createElement("div");
    botResponse.classList.add("message", "bot-message");

    // Simulate a simple bot response for demonstration
    switch(question) {
        case 'What is the contest about?':
            botResponse.textContent = "The contest is about finding the next iconic juice flavor, crafted by you!";
            break;
        case 'How can I participate?':
            botResponse.textContent = "You can participate by submitting your unique juice recipe.";
            break;
        case 'What are the prizes?':
            botResponse.textContent = "Prizes include gift cards, exclusive merchandise, and more!";
            break;
        case 'When does the contest end?':
            botResponse.textContent = "The contest end date will be announced on our website soon.";
            break;
        default:
            botResponse.textContent = "I'm here to help with any questions about the contest.";
    }

    chatBox.appendChild(botResponse);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the latest message
}
