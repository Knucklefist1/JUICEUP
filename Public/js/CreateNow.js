document.addEventListener("DOMContentLoaded", async () => {
    const ingredientContainer = document.getElementById("ingredientContainer");
    const percentageDisplay = document.getElementById("percentageDisplay");
    const createBtn = document.querySelector(".create-btn");

    // Function to update the total percentage of selected ingredients
    const updateTotalPercentage = () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        let total = 0;

        sliders.forEach(slider => {
            total += parseInt(slider.value, 10);
        });

        percentageDisplay.textContent = `${total}%`;
        createBtn.disabled = (total !== 100);
    };

    // Fetch ingredients from the backend
    try {
        const response = await fetch("http://localhost:3000/ingredients/getAll", {
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
            label.innerText = ingredient.name;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "100";
            slider.value = "0";
            slider.dataset.ingredientId = ingredient.id; // Correct dataset assignment
            slider.addEventListener("input", updateTotalPercentage);

            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            ingredientContainer.appendChild(wrapper);
        });

        updateTotalPercentage();
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        alert("An error occurred while loading ingredients. Please try again later.");
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
            const response = await fetch("http://localhost:3000/juice/add", {
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
