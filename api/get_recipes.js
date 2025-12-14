// api/get_recipes.js

import { createClient } from "@libsql/client";

const turso = createClient ({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

// api handler
export default async function handler(req, res) {

// GET request when called from getRecipes()
    if (req.method === 'GET') {
        const dropValue = req.query.category;

        if (!dropValue || typeof dropValue !== 'string') {
            res.status(400).json({ error: 'Missing or invalid category' });
            return;
        }

        let sql = `
        SELECT recipe_id, recipe_name 
        FROM recipes 
        WHERE recipe_category = ?
        ORDER BY recipe_name
        `;
        const args = [dropValue];
        const result = await turso.execute({ sql, args });
        res.status(200).json({ items: result.rows });
        return;
    }
}