import { useState, useCallback } from 'react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function load() {
  try { return JSON.parse(localStorage.getItem('healthPlanner') || '{}') } catch { return {} }
}

function emptyDay() {
  return { exercises: [], meals: [], water: 0, note: '' }
}

export function usePlanner() {
  const [currentDate, setCurrentDate] = useState(todayStr)
  const [data, setData] = useState(load)

  const persist = useCallback((next) => {
    setData(next)
    localStorage.setItem('healthPlanner', JSON.stringify(next))
  }, [])

  const dayData = (d = currentDate) => data[d] ?? emptyDay()

  const updateDay = useCallback((date, updater) => {
    persist(prev => {
      const current = prev[date] ?? emptyDay()
      return { ...prev, [date]: updater(current) }
    })
  }, [persist])

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

  return {
    currentDate, setCurrentDate,
    data,
    dayData,
    prevDay, nextDay,
    addExercise, removeExercise, toggleExercise,
    addMeal, removeMeal, toggleMeal,
    setWater,
    saveNote,
  }
}
