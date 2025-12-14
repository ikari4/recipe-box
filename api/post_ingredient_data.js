// /api/post_ingredient_data.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { ingredientData } = req.body;

            if (!Array.isArray(ingredientData)) {
                return res.status(400).json({ error: "Invalid recipe array" });
            }

            for (const item of ingredientData) {
                const sql = `
                    INSERT INTO recipe_ingredients (
                        recipe_id,
                        ingredient_id,
                        unit_id,
                        amount_whole,
                        amount_frac,
                        ingredient_no
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `;

                const args = [
                    item.recipe_id,
                    item.ingredient_id,
                    item.unit_id,
                    item.amount_whole,
                    item.amount_frac,
                    item.ingredient_no
                ];

                await turso.execute({ sql, args });
                }

            return res.status(200).json({ success: true });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database insert failed" });
        }
    }

  res.status(405).json({ error: "Method not allowed" });
}