document.addEventListener("DOMContentLoaded", async () => {
    const ingredientContainer = document.getElementById("ingredientContainer");
    const percentageDisplay = document.getElementById("percentageDisplay");
    const createBtn = document.querySelector(".create-btn");

    // Funktion til at opdatere den samlede procentdel
    const updateTotalPercentage = () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        let total = 0;

        sliders.forEach(slider => {
            total += parseInt(slider.value, 10);
        });

        percentageDisplay.textContent = `${total}%`;
        createBtn.disabled = (total !== 100);
    };

    // Hent ingredienser fra backend
    try {
        const response = await fetch("http://localhost:3000/ingredients/getAll", {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Failed to fetch ingredients");
        }
        const ingredients = await response.json();

        // Render sliders for hver ingrediens
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
            slider.dataset.ingredientId = ingredient.ingredient_id; // Gem ingrediens ID til senere brug
            slider.addEventListener("input", updateTotalPercentage);

            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            ingredientContainer.appendChild(wrapper);
        });

        updateTotalPercentage();
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        alert("Der opstod en fejl ved indlæsning af ingredienser. Prøv igen senere.");
    }

    const form = document.getElementById("juiceForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const juiceName = document.getElementById("juiceName").value;
        const juiceDescription = document.getElementById("juiceDescription").value;

        // Saml valgte ingredienser og deres mængder
        const selectedIngredients = [];
        document.querySelectorAll('.ingredient-slider input[type="range"]').forEach((slider) => {
            const quantity = parseInt(slider.value, 10);
            if (quantity > 0) {
                selectedIngredients.push({
                    ingredient_id: parseInt(slider.dataset.ingredientId, 10), // Brug ingrediens ID fra dataset
                    quantity: quantity
                });
            }
        });

        // Opret juicen sammen med ingredienser og beskrivelse
        const juiceData = {
            name: juiceName,
            description: juiceDescription,
            ingredients: selectedIngredients
        };

        try {
            const response = await fetch("http://localhost:3000/juice/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(juiceData),
                credentials: "include" // Dette sikrer, at cookies (session) er inkluderet i anmodninger
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating juice: ${errorText}`);
            }

            const jsonResponse = await response.json();
            console.log("Juice created successfully:", jsonResponse);
            alert("Juice created successfully!");
            window.location.href = "/leaderboard.html"; // Redirect til leaderboard eller en anden side
        } catch (error) {
            console.error("Error creating juice:", error);
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
