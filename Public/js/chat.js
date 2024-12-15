function openChat() {
    // Åbner chatvinduet ved at ændre display til flex
    document.getElementById("chatModal").style.display = "flex";
}

function closeChat() {
    // Lukker chatvinduet ved at ændre display til none
    document.getElementById("chatModal").style.display = "none";
}

function acceptPrivacyTerms() {
    // Viser en besked, når brugeren accepterer privatlivsbetingelserne
    alert("Tak for at acceptere privatlivsbetingelserne. Du er nu kvalificeret til at deltage i konkurrencen!");
}

function sendQuestion(question) {
    const chatBox = document.getElementById("chatBox");

    // Opretter og tilføjer brugerens besked til chatboksen
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = question;
    chatBox.appendChild(userMessage);

    // Opretter og tilføjer botens svar til chatboksen
    const botResponse = document.createElement("div");
    botResponse.classList.add("message", "bot-message");

    // Simulerer en simpel bot-respons baseret på brugerens spørgsmål
    switch(question) {
        case 'What is the contest about?':
            botResponse.textContent = "Konkurrencen handler om at finde den næste ikoniske juice-smag, skabt af dig!";
            break;
        case 'How can I participate?':
            botResponse.textContent = "Du kan deltage ved at indsende din unikke juiceopskrift.";
            break;
        case 'What are the prizes?':
            botResponse.textContent = "Præmier inkluderer gavekort, eksklusivt merchandise og meget mere!";
            break;
        case 'When does the contest end?':
            botResponse.textContent = "Slutdatoen for konkurrencen vil snart blive annonceret på vores hjemmeside.";
            break;
        default:
            botResponse.textContent = "Jeg er her for at hjælpe med spørgsmål om konkurrencen.";
    }

    chatBox.appendChild(botResponse);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll til den nyeste besked
}
