// /api/update_recipe_metadata.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
    try {
        if (req.method !== 'PATCH') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { recipe_id, recipe_name, recipe_category, recipe_description } = req.body || {};

        if (!recipe_id) {
            return res.status(400).json({ error: 'Missing recipe_id' });
        }

        // build update statement dynamically for provided fields
        const updates = [];
        const args = [];

        if (typeof recipe_name === 'string') {
            updates.push('recipe_name = ?');
            args.push(recipe_name);
        }
        if (typeof recipe_category === 'string') {
            updates.push('recipe_category = ?');
            args.push(recipe_category);
        }
        if (typeof recipe_description === 'string') {
            updates.push('recipe_description = ?');
            args.push(recipe_description);
        }

        if (!updates.length) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const sql = `UPDATE recipes SET ${updates.join(', ')} WHERE recipe_id = ?`;
        args.push(recipe_id);

        await turso.execute({ sql, args });

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
