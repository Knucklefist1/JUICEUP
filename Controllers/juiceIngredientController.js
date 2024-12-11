const sql = require("mssql");
const config = require("../Config/Database");

// Tilføj en juice ingrediens
exports.addJuiceIngredient = async (juice_id, ingredient_id, quantity) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input("juice_id", sql.Int, juice_id);
        request.input("ingredient_id", sql.Int, ingredient_id);
        request.input("quantity", sql.Float, quantity);

        await request.query(`
            INSERT INTO JuiceIngredient (juice_id, ingredient_id, quantity)
            VALUES (@juice_id, @ingredient_id, @quantity)
        `);
    } catch (err) {
        console.error("Error adding juice ingredient:", err);
    }
};