// leaderboard.js

async function loadJuicesFromDatabase() {
    try {
        const response = await fetch("http://164.92.247.82:3000/api/juice/getAll");
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

    juices.forEach((juice, index) => {
        const juiceItem = document.createElement("div");
        juiceItem.classList.add("juice-item");

        const ingredientsList = juice.ingredients
            .map(ingredient => `<li>${ingredient.name}: ${ingredient.quantity}%</li>`)
            .join(""); // Use 'quantity' as fetched from the backend

        // Create a unique ID for each chart
        const chartId = `ingredientsChart-${index}`;

        juiceItem.innerHTML = `
            <h3>${juice.name}</h3>
            <p>Created by: ${juice.creator}</p>
            <p>Description: ${juice.description}</p>
            <p>Votes: <span id="votes-${index}">${juice.votes}</span></p>
            <button class="vote-button" onclick="vote(${index}, ${juice.id})">Vote</button>
            <h4>Ingredients:</h4>
            <ul>${ingredientsList}</ul>
            <canvas id="${chartId}" width="200" height="200"></canvas>
        `;
        juicesList.appendChild(juiceItem);

        // Create the pie chart for this juice
        createIngredientsChart(chartId, juice.ingredients);
    });
}

async function updateLeaderboard() {
    const juices = await loadJuicesFromDatabase();

    if (!Array.isArray(juices) || juices.length === 0) {
        console.error("No juices found or data is not in the correct format");
        return;
    }

    // Sort juices by votes to get the top three juices
    const sortedJuices = [...juices].sort((a, b) => b.votes - a.votes).slice(0, 3);
    const podium = document.getElementById("podium");
    podium.innerHTML = ""; // Clear previous podium items

    const ranks = ["first", "second", "third"];
    sortedJuices.forEach((juice, index) => {
        // Create a unique ID for each chart
        const chartId = `podiumChart-${index}`;

        const podiumItem = document.createElement("div");
        podiumItem.classList.add("podium-item");

        podiumItem.innerHTML = `
            
            <div class="avatar ${ranks[index]}"></div>
            <p>${juice.creator}</p>
            <p>Description: ${juice.description}</p>
            <p>Votes: <span id="votes-podium-${index}">${juice.votes}</span></p>
            <button class="vote-button" onclick="vote(${index}, ${juice.id})">Vote</button>
            <canvas id="${chartId}" width="200" height="200"></canvas>
        `;
        podium.appendChild(podiumItem);

        // Create the pie chart for this juice in the podium
        createIngredientsChart(chartId, juice.ingredients);
    });
}



// Function to create a pie chart using Chart.js
function createIngredientsChart(chartId, ingredients) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = ingredients.map(ingredient => ingredient.name);
    const data = ingredients.map(ingredient => ingredient.quantity);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels.map(() => getRandomColor()), // Assign a random color for each ingredient
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to handle voting
async function vote(createNow, juiceId) {
    try {
        const response = await fetch(`http://164.92.247.82:3000/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // Include credentials for session
            body: JSON.stringify({ juice_id: juiceId }) // Send juice ID in the request body
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to vote: ${errorText}`);
        }

        // Assuming the backend returns the updated vote count in JSON response
        const result = await response.json();
        document.getElementById(`votes-${createNow}`).textContent = result.updatedVotes; // Update the vote count
        console.log(`Vote registered. New vote count: ${result.updatedVotes}`);

        // Update leaderboard and podium after voting
        updateLeaderboard();
        displayJuices();
    } catch (error) {
        console.error("Error voting for juice:", error);
        alert("An error occurred while voting. You may have already voted.");
    }
}

// Initialize leaderboard
document.addEventListener("DOMContentLoaded", () => {
    displayJuices();
    updateLeaderboard();
});
