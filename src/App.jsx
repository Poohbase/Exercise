import { useState, useCallback } from 'react'
import { usePlanner } from './hooks/usePlanner'
import Header from './components/Header'
import SummaryBar from './components/SummaryBar'
import ExercisePanel from './components/ExercisePanel'
import MealPanel from './components/MealPanel'
import WaterTracker from './components/WaterTracker'
import NotePanel from './components/NotePanel'
import ChartsSection from './components/ChartsSection'

function Toast({ message }) {
  if (!message) return null
  return <div className="toast">{message}</div>
}

export default function App() {
  const {
    currentDate, setCurrentDate,
    data, dayData,
    prevDay, nextDay,
    addExercise, removeExercise, toggleExercise,
    addMeal, removeMeal, toggleMeal,
    setWater,
    saveNote,
  } = usePlanner()

  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2100)
  }, [])

  const handleSaveNote = useCallback((text) => {
    saveNote(text)
    showToast('บันทึกแล้ว ✓')
  }, [saveNote, showToast])

  const d = dayData(currentDate)

  return (
    <>
      <Header
        currentDate={currentDate}
        onPrev={prevDay}
        onNext={nextDay}
        onDateChange={setCurrentDate}
      />

      <SummaryBar exercises={d.exercises} meals={d.meals} water={d.water} />

      <div className="main">
        <ExercisePanel
          exercises={d.exercises}
          onAdd={addExercise}
          onRemove={removeExercise}
          onToggle={toggleExercise}
        />
        <MealPanel
          meals={d.meals}
          onAdd={addMeal}
          onRemove={removeMeal}
          onToggle={toggleMeal}
        />
      </div>

      <div className="bottom-row">
        <WaterTracker water={d.water} onSet={setWater} />
        <NotePanel note={d.note} onSave={handleSaveNote} />
      </div>

      <ChartsSection currentDate={currentDate} data={data} />

      <Toast message={toast} />
    </>
  )
}
