// Bestemmer om applikationen kører lokalt eller i produktion
const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

// Funktion til at hente juices fra databasen
async function loadJuicesFromDatabase() {
    try {
        const response = await fetch(`${baseUrl}/api/juice/getAll`);
        if (!response.ok) throw new Error("Kunne ikke hente juices fra databasen");

        const juices = await response.json();
        console.log("Juices hentet:", juices); // Logger de hentede data til debugging
        return juices;
    } catch (error) {
        console.error("Fejl ved hentning af juices:", error);
        return [];
    }
}

// Funktion til at vise juices på leaderboardet
async function displayJuices() {
    const juices = await loadJuicesFromDatabase();

    if (!Array.isArray(juices) || juices.length === 0) {
        console.error("Ingen juices fundet, eller data er ikke i det korrekte format");
        return;
    }

    const juicesList = document.getElementById("juices-list");
    juicesList.innerHTML = ""; // Ryd tidligere entries

    juices.forEach((juice, index) => {
        const juiceItem = document.createElement("div");
        juiceItem.classList.add("juice-item");

        const ingredientsList = juice.ingredients
            .map(ingredient => `<li>${ingredient.name}: ${ingredient.quantity}%</li>`)
            .join(""); // Bruger 'quantity', som hentes fra backenden

        // Opretter et unikt ID til hvert diagram
        const chartId = `ingredientsChart-${index}`;

        juiceItem.innerHTML = `
            <h3>${juice.name}</h3>
            <p>Skabt af: ${juice.creator}</p>
            <p>Beskrivelse: ${juice.description}</p>
            <p>Stemmer: <span id="votes-${index}">${juice.votes}</span></p>
            <button class="vote-button" onclick="vote(${index}, ${juice.id})">Stem</button>
            <h4>Ingredienser:</h4>
            <ul>${ingredientsList}</ul>
            <canvas id="${chartId}" width="200" height="200"></canvas>
        `;
        juicesList.appendChild(juiceItem);

        // Opretter cirkeldiagram for denne juice
        createIngredientsChart(chartId, juice.ingredients);
    });
}

// Funktion til at opdatere leaderboardet
async function updateLeaderboard() {
    const juices = await loadJuicesFromDatabase();

    if (!Array.isArray(juices) || juices.length === 0) {
        console.error("Ingen juices fundet, eller data er ikke i det korrekte format");
        return;
    }

    // Sorterer juices efter stemmer for at finde de tre bedste
    const sortedJuices = [...juices].sort((a, b) => b.votes - a.votes).slice(0, 3);
    const podium = document.getElementById("podium");
    podium.innerHTML = ""; // Ryd tidligere podium-indhold

    const ranks = ["first", "second", "third"];
    sortedJuices.forEach((juice, index) => {
        // Opretter et unikt ID til hvert diagram
        const chartId = `podiumChart-${index}`;

        const podiumItem = document.createElement("div");
        podiumItem.classList.add("podium-item");

        podiumItem.innerHTML = `
            <div class="avatar ${ranks[index]}"></div>
            <p class="juice-name">${juice.name}</p> <!-- Tilføjer juicens navn -->
            <p>Skaber: ${juice.creator}</p>
            <p>Beskrivelse: ${juice.description}</p>
            <p>Stemmer: <span id="votes-podium-${index}">${juice.votes}</span></p>
            <button class="vote-button" onclick="vote(${index}, ${juice.id})">Stem</button>
            <canvas id="${chartId}" width="200" height="200"></canvas>
        `;
        podium.appendChild(podiumItem);

        // Opretter cirkeldiagram for denne juice på podiumet
        createIngredientsChart(chartId, juice.ingredients);
    });
}

// Funktion til at oprette cirkeldiagram ved hjælp af Chart.js
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
                backgroundColor: labels.map(() => getRandomColor()), // Tildeler tilfældige farver til hver ingrediens
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

// Hjælpefunktion til at generere tilfældige farver
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Funktion til at stemme på en juice
async function vote(createNow, juiceId) {
    try {
        const response = await fetch(`${baseUrl}/api/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ juice_id: juiceId })
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                alert(errorData.error || "Der opstod en fejl.");
            } else {
                alert(`Uventet fejl: ${response.statusText}`);
            }
            return;
        }

        const result = await response.json();
        document.getElementById(`votes-${createNow}`).textContent = result.updatedVotes;
        console.log(`Stem registreret. Nyt stemmetal: ${result.updatedVotes}`);

        updateLeaderboard();
        displayJuices();
    } catch (error) {
        console.error("Fejl ved stemmeafgivelse:", error);
        alert("Der opstod en fejl under stemmeafgivelsen.");
    }
}

// Initialiser leaderboardet
document.addEventListener("DOMContentLoaded", () => {
    displayJuices();
    updateLeaderboard();
});
