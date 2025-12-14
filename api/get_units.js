// api/get_units.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// api handler
export default async function handler(req, res) {

    if (req.method === 'GET') {

        let sql = `
        SELECT unit_id, unit_name 
        FROM units
        ORDER BY unit_id
        `;

        const result = await turso.execute({ sql });
        res.status(200).json({ units: result.rows });
        return;
    }

}