document.addEventListener("DOMContentLoaded", async () => {
    const ingredientContainer = document.getElementById("ingredientContainer");
    const percentageDisplay = document.getElementById("percentageDisplay");
    const createBtn = document.querySelector(".create-btn");
    const juiceFill = document.getElementById("juice-fill");

    // Determine if running locally or in production
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://164.92.247.82:3000';

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

    // Function to update the total percentage of selected ingredients
    const updateTotalPercentage = () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        let total = 0;

        sliders.forEach(slider => {
            total += parseInt(slider.value, 10);
        });

        percentageDisplay.textContent = `Total: ${total}%`;
        createBtn.disabled = (total !== 100);

        // Opdater højden på juice-fyldet
        const maxJuiceHeight = 50; // Maksimal procentdel af koppen der kan fyldes (85% af højden)
        const calculatedHeight = (total / 100) * maxJuiceHeight; // Beregn højden baseret på slider værdi
        juiceFill.style.height = `${calculatedHeight}%`; // Opdater højden af fyldet

        // Juster bølgeanimationens højde
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.bottom = `-${calculatedHeight / 5}px`; // Juster bølgehøjden for at sikre, at de bevæger sig med væsken
        });
    };

    // Fetch ingredients from the backend
    try {
        const response = await fetch(`${baseUrl}/ingredients/getAll`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Failed to fetch ingredients");
        }
        const ingredients = await response.json();

        console.log("Fetched Ingredients:", ingredients); // Debug log to verify ingredients

        // Render sliders for each ingredient
        ingredients.forEach(ingredient => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("ingredient-slider");

            const label = document.createElement("label");

            // Add emoji to ingredient name
            const emoji = ingredientEmojis[ingredient.name] || ""; // Get emoji if it exists
            label.innerText = `${emoji} ${ingredient.name}`;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "100";
            slider.value = "0";
            slider.dataset.ingredientId = ingredient.id; // Correct dataset assignment
            slider.dataset.previousValue = "0"; // Dataset to store previous value

            slider.addEventListener("input", () => {
                let currentTotal = 0;
                const sliders = document.querySelectorAll('input[type="range"]');
                sliders.forEach(s => {
                    currentTotal += parseInt(s.value, 10);
                });

                // Ensure total percentage does not exceed 100
                if (parseInt(slider.value, 10) > parseInt(slider.dataset.previousValue, 10) &&
                    currentTotal > 100) {
                    slider.value = slider.dataset.previousValue; // Roll back to previous value if over 100
                } else {
                    slider.dataset.previousValue = slider.value; // Update the previous value
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
        console.error("Error fetching ingredients:", error);
        alert("An error occurred while loading ingredients. Please log in to and try again");
    }


    const form = document.getElementById("juiceForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const juiceName = document.getElementById("juiceName").value.trim();
        const juiceDescription = document.getElementById("juiceDescription").value.trim();

        if (!juiceName || !juiceDescription) {
            alert("Juice name and description are required.");
            return;
        }

        // Collect selected ingredients
        const selectedIngredients = [];
        document.querySelectorAll('.ingredient-slider input[type="range"]').forEach((slider) => {
            const quantity = parseInt(slider.value, 10);
            const ingredientId = parseInt(slider.dataset.ingredientId, 10);

            // Additional Debugging: Log each slider's values
            console.log(`Slider Ingredient ID: ${ingredientId}, Quantity: ${quantity}`);

            if (quantity > 0 && !isNaN(ingredientId)) {
                selectedIngredients.push({
                    ingredient_id: ingredientId,
                    quantity: quantity
                });
            }
        });

        // Additional Debugging: Log selected ingredients
        console.log("Selected Ingredients:", selectedIngredients);

        if (selectedIngredients.length === 0) {
            alert("Please select at least one ingredient.");
            return;
        }

        const juiceData = {
            name: juiceName,
            description: juiceDescription,
            ingredients: selectedIngredients
        };

        console.log("Juice Data to Send:", juiceData); // Logging to verify data before sending

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
                throw new Error(`Error creating juice: ${errorText}`);
            }

            const jsonResponse = await response.json();
            console.log("Juice created successfully:", jsonResponse);
            alert("Juice created successfully!");
            window.location.href = "/leaderboard.html";
        } catch (error) {
            console.error("Error creating juice:", error);
            alert("An error occurred. Please try again.");
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
