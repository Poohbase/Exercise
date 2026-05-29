import { neon } from '@neondatabase/serverless'

export function getDb() {
  return neon(process.env.DATABASE_URL)
}

export async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS health_data (
      date      TEXT PRIMARY KEY,
      exercises TEXT NOT NULL DEFAULT '[]',
      meals     TEXT NOT NULL DEFAULT '[]',
      water     INTEGER NOT NULL DEFAULT 0,
      note      TEXT NOT NULL DEFAULT ''
    )
  `
}

export function deserialize(row) {
  return {
    exercises: JSON.parse(row.exercises),
    meals: JSON.parse(row.meals),
    water: row.water,
    note: row.note,
  }
}
