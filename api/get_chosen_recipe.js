// api/get_chosen_recipe.js

import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// helper to validate strings
const isValidString = (s) => typeof s === 'string' && s.trim().length > 0;

export default async function handler(req, res) {
    try {

        if (req.method === 'GET') {
            const { searchTerm } = req.query || {};

            if (!isValidString(searchTerm)) {
                res.status(400).json({ error: 'Missing search term' });
                return;
            }

            let recSql = `SELECT 
                recipe_name,
                recipe_description, 
                recipe_category 
                FROM recipes WHERE recipe_id = ?`;
            const recResults = await turso.execute({ 
                sql: recSql,
                args: [searchTerm] 
            });
            
            let stepSql = `SELECT step_no, step_text FROM recipe_steps WHERE recipe_id = ?`;
            const stepResults = await turso.execute({                 
                sql: stepSql,
                args: [searchTerm] 
            });

            let ingrSql1 = `SELECT 
                ingredient_id, 
                ingredient_no,
                amount_whole,
                amount_frac,
                unit_id
                FROM recipe_ingredients WHERE recipe_id = ?
                ORDER BY ingredient_no`;
            const ingr1Results = await turso.execute({                 
                sql: ingrSql1,
                args: [searchTerm] 
            });

            const ingredientIds = ingr1Results.rows.map(row => row.ingredient_id);
            const uniqueIngredientIds = [...new Set(ingredientIds)];
            const placeholders = uniqueIngredientIds.map(() => '?').join(',');

            const ingrSql2 = `
                SELECT ingredient_id, ingredient_name
                FROM ingredients
                WHERE ingredient_id IN (${placeholders})
            `;

            const ingr2Results = await turso.execute({
            sql: ingrSql2,
            args: uniqueIngredientIds,
            });

            const ingredientMap = {};
                ingr2Results.rows.forEach(row => {
                ingredientMap[row.ingredient_id] = row.ingredient_name;
                });

            const recipeIngredients = ingr1Results.rows.map(row => ({
                ...row,
                ingredient_name: ingredientMap[row.ingredient_id] || null
            }));


            res.status(200).json({ 
                recipeMeta: recResults.rows,
                recipeSteps: stepResults.rows,
                recipeIngredients
            });
            return;
        };
        // if any other HTTP method → not allowed
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}