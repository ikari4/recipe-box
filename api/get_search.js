// api/get_search.js

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

      let sql = `SELECT ingredient_id, ingredient_name FROM ingredients WHERE ingredient_name LIKE ?`;
      const args = [`%${searchTerm}%`];

      const result = await turso.execute({ sql, args });
      res.status(200).json({ items: result.rows });
      return;
    }

    // if any other HTTP method → not allowed
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}