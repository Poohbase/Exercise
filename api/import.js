import { getDb, ensureTable } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const body = req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })

  try {
    const sql = getDb()
    await ensureTable(sql)

    for (const [date, day] of Object.entries(body)) {
      await sql`
        INSERT INTO health_data (date, exercises, meals, water, note)
        VALUES (${date}, ${JSON.stringify(day.exercises ?? [])}, ${JSON.stringify(day.meals ?? [])}, ${day.water ?? 0}, ${day.note ?? ''})
        ON CONFLICT (date) DO UPDATE SET
          exercises = EXCLUDED.exercises,
          meals     = EXCLUDED.meals,
          water     = EXCLUDED.water,
          note      = EXCLUDED.note
      `
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
}
