document.addEventListener("DOMContentLoaded", () => {
    const ingredients = [
        "Æble", "Ingefær", "Gulerod", "Ananas", "Banan", "Citron", 
        "Spinat", "Agurk", "Grønkål", "Seleri", "Kiwi", 
        "Jordbær", "Avocado", "Passionsfrugt"
    ];

    const ingredientContainer = document.getElementById("ingredientContainer");
    const percentageDisplay = document.getElementById("percentageDisplay");
    const createBtn = document.querySelector(".create-btn");

    const updateTotalPercentage = () => {
        const sliders = document.querySelectorAll('input[type="range"]');
        let total = 0;
        
        sliders.forEach(slider => {
            total += parseInt(slider.value, 10);
        });

        percentageDisplay.textContent = `${total}%`;
        createBtn.disabled = (total !== 100);
    };

    ingredients.forEach(ingredient => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("ingredient-slider");

        const label = document.createElement("label");
        label.innerText = ingredient;
        
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = "0";
        slider.addEventListener("input", updateTotalPercentage);

        wrapper.appendChild(label);
        wrapper.appendChild(slider);
        ingredientContainer.appendChild(wrapper);
    });

    updateTotalPercentage();

    const form = document.getElementById("juiceForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const juiceName = document.getElementById("juiceName").value;
        const description = "Description of your juice"; // Add an actual description if needed

        // Create the juice
        const juiceResult = await createJuice({
            name: juiceName,
            description: description
        });

        // Collect selected ingredients and their quantities
        const selectedIngredients = [];
        document.querySelectorAll('.ingredient-slider input[type="range"]').forEach((slider, createNow) => {
            const quantity = parseInt(slider.value, 10);
            if (quantity > 0) {
                selectedIngredients.push({
                    name: ingredients[createNow],
                    quantity: quantity
                });
            }
        });

        // Register each ingredient in the database
        for (const ingredient of selectedIngredients) {
            await addIngredientToDatabase(ingredient);
        }

        showResultModal(juiceName, selectedIngredients);
    });

    const createJuice = async (juiceData) => {
        try {
          const response = await fetch("http://localhost:3000/juice/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(juiceData),
            credentials: "include" // This ensures cookies (session) are included in requests
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error creating juice: ${errorText}`);
          }
      
          const jsonResponse = await response.json();
          console.log("Juice created successfully:", jsonResponse);
          return jsonResponse;
        } catch (error) {
          console.error("Error creating juice:", error);
        }
      };

      const addIngredientToDatabase = async (ingredientData) => {
        try {
            // Først tjek om ingrediensen allerede findes
            const response = await fetch("http://localhost:3000/ingredient/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: ingredientData.name })
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error checking ingredient: ${errorText}`);
            }
    
            const jsonResponse = await response.json();
            if (jsonResponse.exists) {
                console.log(`Ingredient ${ingredientData.name} already exists.`);
                return; // Hvis ingrediensen findes, skal den ikke oprettes igen
            }
    
            // Hvis ingrediensen ikke findes, så opret den
            const addResponse = await fetch("http://localhost:3000/ingredient/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: ingredientData.name,
                    quantity: ingredientData.quantity
                })
            });
    
            if (!addResponse.ok) {
                const errorText = await addResponse.text();
                throw new Error(`Error adding ingredient: ${errorText}`);
            }
    
            const addJsonResponse = await addResponse.json();
            console.log("Ingredient added successfully:", addJsonResponse);
            return addJsonResponse;
        } catch (error) {
            console.error("Error adding ingredient:", error);
        }
    };
    

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
