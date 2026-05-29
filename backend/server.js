import express from 'express'
import cors from 'cors'
import { getAll, getDay, upsertDay, importAll } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// GET all data
app.get('/api/data', (req, res) => {
  res.json(getAll())
})

// GET one day
app.get('/api/data/:date', (req, res) => {
  const day = getDay(req.params.date)
  if (!day) return res.status(404).json({ error: 'not found' })
  res.json(day)
})

// PUT (upsert) one day
app.put('/api/data/:date', (req, res) => {
  const { date } = req.params
  const body = req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })
  upsertDay(date, body)
  res.json({ ok: true })
})

// POST bulk import
app.post('/api/import', (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })
  importAll(body)
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
