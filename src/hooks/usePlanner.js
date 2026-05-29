import { useState, useCallback, useEffect } from 'react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem('healthPlanner') || '{}') } catch { return {} }
}

function saveLocal(data) {
  localStorage.setItem('healthPlanner', JSON.stringify(data))
}

function emptyDay() {
  return { exercises: [], meals: [], water: 0, note: '' }
}

async function apiGet(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(res.status)
  return res.json()
}

async function apiPut(date, day) {
  await fetch(`/api/data/${date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(day),
  })
}

async function apiImport(dataObj) {
  await fetch('/api/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataObj),
  })
}

export function usePlanner() {
  const [currentDate, setCurrentDate] = useState(todayStr)
  const [data, setData] = useState(loadLocal)

  // Load all data from backend on mount
  useEffect(() => {
    apiGet('/api/data')
      .then(serverData => {
        setData(prev => {
          const merged = { ...prev, ...serverData }
          saveLocal(merged)
          return merged
        })
      })
      .catch(() => {}) // fall back to localStorage if backend is unavailable
  }, [])

  const persist = useCallback((next, date, day) => {
    setData(prev => {
      const updated = typeof next === 'function' ? next(prev) : next
      saveLocal(updated)
      if (date && day) {
        apiPut(date, day).catch(() => {})
      }
      return updated
    })
  }, [])

  const dayData = (d = currentDate) => data[d] ?? emptyDay()

  const updateDay = useCallback((date, updater) => {
    setData(prev => {
      const current = prev[date] ?? emptyDay()
      const updated = updater(current)
      const next = { ...prev, [date]: updated }
      saveLocal(next)
      apiPut(date, updated).catch(() => {})
      return next
    })
  }, [])

  const addExercise = useCallback((item) => {
    updateDay(currentDate, d => ({ ...d, exercises: [...d.exercises, item] }))
  }, [currentDate, updateDay])

  const removeExercise = useCallback((idx) => {
    updateDay(currentDate, d => ({ ...d, exercises: d.exercises.filter((_, i) => i !== idx) }))
  }, [currentDate, updateDay])

  const toggleExercise = useCallback((idx) => {
    updateDay(currentDate, d => ({
      ...d,
      exercises: d.exercises.map((e, i) => i === idx ? { ...e, done: !e.done } : e),
    }))
  }, [currentDate, updateDay])

  const addMeal = useCallback((item) => {
    updateDay(currentDate, d => ({ ...d, meals: [...d.meals, item] }))
  }, [currentDate, updateDay])

  const removeMeal = useCallback((idx) => {
    updateDay(currentDate, d => ({ ...d, meals: d.meals.filter((_, i) => i !== idx) }))
  }, [currentDate, updateDay])

  const toggleMeal = useCallback((idx) => {
    updateDay(currentDate, d => ({
      ...d,
      meals: d.meals.map((m, i) => i === idx ? { ...m, done: !m.done } : m),
    }))
  }, [currentDate, updateDay])

  const setWater = useCallback((glasses) => {
    updateDay(currentDate, d => ({ ...d, water: glasses }))
  }, [currentDate, updateDay])

  const saveNote = useCallback((note) => {
    updateDay(currentDate, d => ({ ...d, note }))
  }, [currentDate, updateDay])

  const prevDay = useCallback(() => {
    setCurrentDate(cur => {
      const d = new Date(cur); d.setDate(d.getDate() - 1)
      return d.toISOString().slice(0, 10)
    })
  }, [])

  const nextDay = useCallback(() => {
    setCurrentDate(cur => {
      const d = new Date(cur); d.setDate(d.getDate() + 1)
      return d.toISOString().slice(0, 10)
    })
  }, [])

  const importData = useCallback((newData) => {
    if (newData && typeof newData === 'object') {
      setData(newData)
      saveLocal(newData)
      apiImport(newData).catch(() => {})
      return true
    }
    return false
  }, [])

  return {
    currentDate, setCurrentDate,
    data,
    dayData,
    prevDay, nextDay,
    addExercise, removeExercise, toggleExercise,
    addMeal, removeMeal, toggleMeal,
    setWater,
    saveNote,
    importData,
  }
}
