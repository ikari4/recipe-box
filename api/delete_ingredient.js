// api/delete.js

import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  try {

    if (req.method === 'DELETE') {
      const { ingredient_id } = req.body || {};

      if (!ingredient_id) {
        res.status(400).json({ error: 'Invalid DELETE data' });
        return;
      }

      await turso.execute({
        sql: `DELETE FROM ingredients WHERE ingredient_id = ?`,
        args: [ingredient_id],
      });

      res.status(200).json({ ok: true });
      return;
    }

    // if any other HTTP method → not allowed
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}