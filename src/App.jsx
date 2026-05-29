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
    importData,
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

  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `health-planner-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast('ส่งออกข้อมูลสำเร็จแล้ว 💾')
    } catch (e) {
      showToast('การส่งออกข้อมูลล้มเหลว ❌')
    }
  }, [data, showToast])

  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result)
        if (importData(parsed)) {
          showToast('นำเข้าข้อมูลสำเร็จแล้ว 📂')
        } else {
          showToast('ไฟล์ข้อมูลไม่ถูกต้อง ❌')
        }
      } catch (err) {
        showToast('ไฟล์ข้อมูลไม่ถูกต้อง ❌')
      }
    }
    reader.readAsText(file)
  }, [importData, showToast])

  const d = dayData(currentDate)

  return (
    <>
      <Header
        currentDate={currentDate}
        onPrev={prevDay}
        onNext={nextDay}
        onDateChange={setCurrentDate}
        onExport={handleExport}
        onImport={handleImport}
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
