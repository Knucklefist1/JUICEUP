document.addEventListener("DOMContentLoaded", async () => {
    const ingredientContainer = document.getElementById("ingredientContainer");
    const percentageDisplay = document.getElementById("percentageDisplay");
    const createBtn = document.querySelector(".create-btn");
    const juiceFill = document.getElementById("juice-fill");

    // Bestem om applikationen kører lokalt eller i produktion
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://www.joejuicecompetition.live';

    // Ingrediensdata med emojis
    const ingredientEmojis = {
        "Æble": "🍏",
        "Ingefær": "🪵",
        "Gulerod": "🥕",
        "Ananas": "🍍",
        "Banan": "🍌",
        "Citron": "🍋",
        "Spinat": "🌿",
        "Agurk": "🥒",
        "Grønkål": "🥬",
        "Seleri": "🌱",
        "Kiwi": "🥝",
        "Jordbær": "🍓",
        "Avocado": "🥑",
        "Passionsfrugt": "🥭"
    };

    // Funktion til at opdatere den samlede procentdel af valgte ingredienser
    const updateTotalPercentage = () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        let total = 0;

        sliders.forEach(slider => {
            total += parseInt(slider.value, 10);
        });

        percentageDisplay.textContent = `Total: ${total}%`;
        createBtn.disabled = (total !== 100);

        // Opdater højden på juice-fyldet
        const maxJuiceHeight = 50; // Maksimal højde på koppen
        const calculatedHeight = (total / 100) * maxJuiceHeight; 
        juiceFill.style.height = `${calculatedHeight}%`; 

        // Juster bølgeanimationens højde
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.bottom = `-${calculatedHeight / 5}px`;
        });
    };

    // Hent ingredienser fra backend
    try {
        const response = await fetch(`${baseUrl}/ingredients/getAll`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Kunne ikke hente ingredienser");
        }
        const ingredients = await response.json();

        console.log("Hentede ingredienser:", ingredients); 

        // Render sliders for hver ingrediens
        ingredients.forEach(ingredient => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("ingredient-slider");

            const label = document.createElement("label");

            // Tilføj emoji til ingrediensnavn
            const emoji = ingredientEmojis[ingredient.name] || ""; 
            label.innerText = `${emoji} ${ingredient.name}`;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "100";
            slider.value = "0";
            slider.dataset.ingredientId = ingredient.id;
            slider.dataset.previousValue = "0";

            slider.addEventListener("input", () => {
                let currentTotal = 0;
                const sliders = document.querySelectorAll('input[type="range"]');
                sliders.forEach(s => {
                    currentTotal += parseInt(s.value, 10);
                });

                // Sikrer, at den samlede procentdel ikke overstiger 100
                if (parseInt(slider.value, 10) > parseInt(slider.dataset.previousValue, 10) &&
                    currentTotal > 100) {
                    slider.value = slider.dataset.previousValue; 
                } else {
                    slider.dataset.previousValue = slider.value; 
                    slider.style.background = `linear-gradient(to right, #ff69b4 ${slider.value}%, #ddd ${slider.value}%)`;
                    updateTotalPercentage();
                }
            });

            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            ingredientContainer.appendChild(wrapper);
        });

        updateTotalPercentage();
    } catch (error) {
        console.error("Fejl ved hentning af ingredienser:", error);
        alert("Log ind eller tilmeld dig for at lave en juice.");
    }

    const form = document.getElementById("juiceForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const juiceName = document.getElementById("juiceName").value.trim();
        const juiceDescription = document.getElementById("juiceDescription").value.trim();

        if (!juiceName || !juiceDescription) {
            alert("Juicens navn og beskrivelse er påkrævet.");
            return;
        }

        // Indsaml valgte ingredienser
        const selectedIngredients = [];
        document.querySelectorAll('.ingredient-slider input[type="range"]').forEach((slider) => {
            const quantity = parseInt(slider.value, 10);
            const ingredientId = parseInt(slider.dataset.ingredientId, 10);

            console.log(`Slider Ingrediens-ID: ${ingredientId}, Mængde: ${quantity}`); 

            if (quantity > 0 && !isNaN(ingredientId)) {
                selectedIngredients.push({
                    ingredient_id: ingredientId,
                    quantity: quantity
                });
            }
        });

        console.log("Valgte ingredienser:", selectedIngredients);

        if (selectedIngredients.length === 0) {
            alert("Vælg mindst én ingrediens.");
            return;
        }

        const juiceData = {
            name: juiceName,
            description: juiceDescription,
            ingredients: selectedIngredients
        };

        console.log("Juicedata der sendes:", juiceData); 

        try {
            const response = await fetch(`${baseUrl}/juice/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(juiceData),
                credentials: "include"
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fejl ved oprettelse af juice: ${errorText}`);
            }

            const jsonResponse = await response.json();
            console.log("Juice oprettet med succes:", jsonResponse);
            alert("Juice oprettet med succes!");
            window.location.href = "/leaderboard.html";
        } catch (error) {
            console.error("Fejl ved oprettelse af juice:", error);
            alert("Der opstod en fejl. Prøv igen.");
        }
    });

    const showResultModal = (juiceName, ingredients) => {
        const modal = document.getElementById("resultModal");
        const modalContent = document.getElementById("modalContent");

        modalContent.innerHTML = `<h2>${juiceName}</h2>`;
        for (const ingredient of ingredients) {
            modalContent.innerHTML += `<p><strong>${ingredient.name}:</strong> ${ingredient.quantity}%</p>`;
        }

        modal.style.display = "block";
    };

    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("resultModal").style.display = "none";
    });

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("resultModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
