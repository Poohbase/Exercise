import { useState } from 'react'

const TYPE_CLASS = { cardio: 'tag-cardio', strength: 'tag-strength', stretch: 'tag-stretch', other: 'tag-other' }
const TYPE_LABEL = { cardio: 'Cardio', strength: 'Strength', stretch: 'Stretch', other: 'อื่น ๆ' }

const EMPTY_FORM = { name: '', type: 'cardio', duration: '', sets: '', reps: '', cal: '', note: '' }

export default function ExercisePanel({ exercises, onAdd, onRemove, onToggle }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name.trim()) return
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      type: form.type,
      duration: +form.duration || 0,
      sets: +form.sets || 0,
      reps: +form.reps || 0,
      cal: +form.cal || 0,
      note: form.note.trim(),
      done: false,
    })
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSave() }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>🏋️ แผนออกกำลังกาย</h2>
        <button className="btn btn-green" onClick={() => setOpen(o => !o)}>+ เพิ่ม</button>
      </div>

      {open && (
        <div className="add-form">
          <div className="form-row">
            <div>
              <label>ชื่อท่า / กิจกรรม</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="เช่น วิ่ง, Push-up"
              />
            </div>
            <div>
              <label>ประเภท</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="stretch">Stretch / Yoga</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>เวลา (นาที)</label>
              <input type="number" min="0" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="30" />
            </div>
            <div>
              <label>เซต</label>
              <input type="number" min="0" value={form.sets} onChange={e => set('sets', e.target.value)} placeholder="-" />
            </div>
            <div>
              <label>ครั้ง/เซต</label>
              <input type="number" min="0" value={form.reps} onChange={e => set('reps', e.target.value)} placeholder="-" />
            </div>
            <div>
              <label>แคลเบิร์น (kcal)</label>
              <input type="number" min="0" value={form.cal} onChange={e => set('cal', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>หมายเหตุ</label>
              <input value={form.note} onChange={e => set('note', e.target.value)} placeholder="เพิ่มเติม..." />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => { setOpen(false); setForm(EMPTY_FORM) }}>ยกเลิก</button>
            <button className="btn btn-green" onClick={handleSave}>บันทึก</button>
          </div>
        </div>
      )}

      <div className="item-list">
        {exercises.length === 0
          ? <div className="empty-msg">ยังไม่มีรายการออกกำลังกาย</div>
          : exercises.map((ex, idx) => (
            <div key={ex.id} className={`item${ex.done ? ' done' : ''}`}>
              <div
                className={`item-check${ex.done ? ' checked' : ''}`}
                onClick={() => onToggle(idx)}
              >
                {ex.done ? '✓' : ''}
              </div>
              <div className="item-body">
                <div className="item-name">
                  {ex.name}{' '}
                  <span className={`tag ${TYPE_CLASS[ex.type] || 'tag-other'}`}>
                    {TYPE_LABEL[ex.type] || ex.type}
                  </span>
                </div>
                <div className="item-meta">
                  {ex.duration > 0 && <span>⏱ {ex.duration} นาที</span>}
                  {ex.sets > 0 && ex.reps > 0 && <span>{ex.sets} เซต × {ex.reps} ครั้ง</span>}
                  {ex.sets > 0 && ex.reps === 0 && <span>{ex.sets} เซต</span>}
                  {ex.note && <span>{ex.note}</span>}
                </div>
              </div>
              <div className="item-right">
                {ex.cal > 0 && <span className="cal-badge cal-burn">🔥 {ex.cal}</span>}
                <button className="btn btn-danger" onClick={() => onRemove(idx)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
