const sql = require("mssql");
const config = require("../Config/Database");

// Funktion til at tilføje en ingrediens til en juice
exports.addJuiceIngredient = async (juice_id, ingredient_id, quantity) => {
    try {
        // Opret forbindelse til databasen
        await sql.connect(config);
        const request = new sql.Request();
        request.input("juice_id", sql.Int, juice_id); // Angiver juice_id
        request.input("ingredient_id", sql.Int, ingredient_id); // Angiver ingredient_id
        request.input("quantity", sql.Float, quantity); // Angiver mængde (quantity)

        // SQL-query for at indsætte data i JuiceIngredient-tabellen
        await request.query(`
            INSERT INTO JuiceIngredient (juice_id, ingredient_id, quantity)
            VALUES (@juice_id, @ingredient_id, @quantity)
        `);
    } catch (err) {
        console.error("Fejl ved tilføjelse af juice-ingrediens:", err); // Logger fejl
    }
};
