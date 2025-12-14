// api/get_ingredients.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// api handler
export default async function handler(req, res) {

    if (req.method === 'GET') {

        let sql = `
        SELECT ingredient_id, ingredient_name 
        FROM ingredients
        ORDER BY ingredient_name
        `;

        const result = await turso.execute({ sql });
        res.status(200).json({ ingredients: result.rows });
        return;
    }

}