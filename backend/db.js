import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'health.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS health_data (
    date    TEXT PRIMARY KEY,
    exercises TEXT NOT NULL DEFAULT '[]',
    meals     TEXT NOT NULL DEFAULT '[]',
    water     INTEGER NOT NULL DEFAULT 0,
    note      TEXT NOT NULL DEFAULT ''
  )
`)

export function getAll() {
  const rows = db.prepare('SELECT * FROM health_data').all()
  return Object.fromEntries(rows.map(r => [r.date, deserialize(r)]))
}

export function getDay(date) {
  const row = db.prepare('SELECT * FROM health_data WHERE date = ?').get(date)
  return row ? deserialize(row) : null
}

export function upsertDay(date, day) {
  db.prepare(`
    INSERT INTO health_data (date, exercises, meals, water, note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      exercises = excluded.exercises,
      meals     = excluded.meals,
      water     = excluded.water,
      note      = excluded.note
  `).run(date, JSON.stringify(day.exercises ?? []), JSON.stringify(day.meals ?? []), day.water ?? 0, day.note ?? '')
}

export function importAll(dataObj) {
  const insert = db.prepare(`
    INSERT INTO health_data (date, exercises, meals, water, note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      exercises = excluded.exercises,
      meals     = excluded.meals,
      water     = excluded.water,
      note      = excluded.note
  `)
  const tx = db.transaction((entries) => {
    for (const [date, day] of entries) {
      insert.run(date, JSON.stringify(day.exercises ?? []), JSON.stringify(day.meals ?? []), day.water ?? 0, day.note ?? '')
    }
  })
  tx(Object.entries(dataObj))
}

function deserialize(row) {
  return {
    exercises: JSON.parse(row.exercises),
    meals: JSON.parse(row.meals),
    water: row.water,
    note: row.note,
  }
}
