const sql = require("mssql");
const config = require("../Config/Database");

// Function to add a juice ingredient
exports.addJuiceIngredient = async (juice_id, ingredient_id, quantity) => {
    try {
        // Connect to the database using provided configuration
        await sql.connect(config);

        // Create a request object for database operations
        const request = new sql.Request();
        request.input("juice_id", sql.Int, juice_id);
        request.input("ingredient_id", sql.Int, ingredient_id);
        request.input("quantity", sql.Float, quantity);

        // Run the query to add a juice ingredient
        await request.query(`
            INSERT INTO JuiceIngredient (juice_id, ingredient_id, quantity)
            VALUES (@juice_id, @ingredient_id, @quantity)
        `);

        console.log(`Successfully added ingredient ${ingredient_id} to juice ${juice_id} with quantity ${quantity}.`);
    } catch (err) {
        console.error("Error adding juice ingredient:", err);
    } finally {
        // Close database connection in the 'finally' block to prevent leaks
        sql.close();
    }
};
