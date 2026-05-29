import { getDb, ensureTable, deserialize } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const sql = getDb()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM health_data ORDER BY date`
    const result = Object.fromEntries(rows.map(r => [r.date, deserialize(r)]))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
}
