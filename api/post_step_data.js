// /api/post_step_data.js

import { createClient } from "@libsql/client";

const turso = createClient ({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { stepData } = req.body;

            if (!Array.isArray(stepData)) {
                return res.status(400).json({ error: "Invalid recipe array" });
            }

            // If there are no steps, do nothing
            if (!stepData.length) return res.status(200).json({ success: true });

            const recipe_id = stepData[0].recipe_id;

            // delete existing steps for this recipe (safe even for new recipes)
            await turso.execute({
                sql: `DELETE FROM recipe_steps WHERE recipe_id = ?`,
                args: [recipe_id],
            });

            // insert the new steps
            for (const item of stepData) {
                const sql = `
                    INSERT INTO recipe_steps (
                        recipe_id,
                        step_text,
                        step_no
                    ) VALUES (?, ?, ?)
                `;
                const args = [
                    item.recipe_id,
                    item.step_text,
                    item.step_no
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
