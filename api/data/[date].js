import { getDb, ensureTable, deserialize } from '../_db.js'

export default async function handler(req, res) {
  const { date } = req.query

  try {
    const sql = getDb()
    await ensureTable(sql)

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM health_data WHERE date = ${date}`
      if (rows.length === 0) return res.status(404).json({ error: 'not found' })
      res.json(deserialize(rows[0]))

    } else if (req.method === 'PUT') {
      const body = req.body
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })

      await sql`
        INSERT INTO health_data (date, exercises, meals, water, note)
        VALUES (${date}, ${JSON.stringify(body.exercises ?? [])}, ${JSON.stringify(body.meals ?? [])}, ${body.water ?? 0}, ${body.note ?? ''})
        ON CONFLICT (date) DO UPDATE SET
          exercises = EXCLUDED.exercises,
          meals     = EXCLUDED.meals,
          water     = EXCLUDED.water,
          note      = EXCLUDED.note
      `
      res.json({ ok: true })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
}
