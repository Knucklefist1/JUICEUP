async function loadJuicesFromDatabase() {
    try {
        const response = await fetch("http://localhost:3000/api/juice/getAll");
        if (!response.ok) throw new Error("Failed to fetch juices from database");
        
        const juices = await response.json();
        console.log("Juices fetched:", juices); // Log the fetched data for debugging
        return juices;
    } catch (error) {
        console.error("Error fetching juices:", error);
        return [];
    }
}

async function displayJuices() {
    const juices = await loadJuicesFromDatabase();
    
    if (!Array.isArray(juices) || juices.length === 0) {
        console.error("No juices found or data is not in the correct format");
        return;
    }

    const juicesList = document.getElementById("juices-list");
    juicesList.innerHTML = ""; // Clear previous entries

    juices.forEach((juice, createNow) => {
        const juiceItem = document.createElement("div");
        juiceItem.classList.add("juice-item");

        const ingredientsList = juice.ingredients
            .map(ingredient => `<li>${ingredient.name}: ${ingredient.amount}%</li>`)
            .join("");

        juiceItem.innerHTML = `
            <h3>${juice.name}</h3>
            <p>Created by: ${juice.creator}</p>
            <p>Votes: <span id="votes-${createNow}">${juice.votes}</span></p>
            <button class="vote-button" onclick="vote(${createNow}, ${juice.id})">Vote</button>
            <h4>Ingredients:</h4>
            <ul>${ingredientsList}</ul>
        `;
        juicesList.appendChild(juiceItem);
    });
}

async function updateLeaderboard() {
    const juices = await loadJuicesFromDatabase();

    if (!Array.isArray(juices) || juices.length === 0) {
        console.error("No juices found or data is not in the correct format");
        return;
    }

    const sortedJuices = [...juices].sort((a, b) => b.votes - a.votes).slice(0, 3);
    const podium = document.getElementById("podium");
    podium.innerHTML = ""; // Clear previous podium items

    const ranks = ["first", "second", "third"];
    sortedJuices.forEach((juice, createNow) => {
        const ingredientsList = juice.ingredients
            .map(ingredient => `${ingredient.name}: ${ingredient.amount}%`)
            .join(", ");

        const podiumItem = document.createElement("div");
        podiumItem.classList.add("podium-item");

        podiumItem.innerHTML = `
            <span class="rank">${createNow + 1}</span>
            <div class="avatar ${ranks[createNow]}"></div>
            <p>${juice.creator}</p>
            <p>Votes: ${juice.votes}</p>
            <p>Ingredients: ${ingredientsList}</p>
        `;
        podium.appendChild(podiumItem);
    });
}

// Function to handle voting
async function vote(createNow, juiceId) {
    try {
        const response = await fetch(`http://localhost:3000/api/juice/vote/${juiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to vote");

        const result = await response.json();
        document.getElementById(`votes-${createNow}`).textContent = result.votes; // Update the vote count on the page
        console.log(`Vote registered. New vote count: ${result.votes}`);
    } catch (error) {
        console.error("Error voting for juice:", error);
    }
}

// Initialize leaderboard
document.addEventListener("DOMContentLoaded", () => {
    displayJuices();
    updateLeaderboard();
});
