// api/post_new_ingredient.js

import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// helper to validate strings
const isValidString = (s) => typeof s === 'string' && s.trim().length > 0;

export default async function handler(req, res) {
  try {

    if (req.method === 'POST') {
        const { ingredientName } = req.body || {};

        if (!isValidString(ingredientName)) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        await turso.execute({
            sql: `INSERT INTO ingredients (ingredient_name)
                VALUES (?)`,
            args: [ingredientName.trim()],
        });

        const lastIdResult = await turso.execute({
            sql: `SELECT last_insert_rowid() AS ingredient_id`,
        });

        const newIngredientId = lastIdResult?.rows?.[0]?.ingredient_id;

        if (!newIngredientId) {
            res.status(500).json({ error: 'Could not get new ingredient ID' });
            return;
        }

        res.status(200).json({
            ok: true,
            newIngredient: {
                ingredient_id: newIngredientId,
                ingredient_name: ingredientName.trim(),
            },
        });
        return;
    }
      
    // if any other HTTP method → not allowed
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}