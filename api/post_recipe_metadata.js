// /api/post_recipe_metadata.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { addRecipeData } = req.body;

            if (!Array.isArray(addRecipeData)) {
                return res.status(400).json({ error: "Invalid recipe array" });
            }

            const {
                recipe_name,
                recipe_category,
                recipe_description
            } = addRecipeData[0];

            const sql = `
                INSERT INTO recipes (
                    recipe_name,
                    recipe_category,
                    recipe_description
                ) VALUES (?, ?, ?)
            `;

            const args = [
                recipe_name,
                recipe_category,
                recipe_description
            ];

            const result = await turso.execute({ sql, args });
            const recipe_id = Number(result.lastInsertRowid);

            return res.status(200).json({
                success: true,
                recipe_id
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database insert failed" });
        }
    }

  res.status(405).json({ error: "Method not allowed" });
}
