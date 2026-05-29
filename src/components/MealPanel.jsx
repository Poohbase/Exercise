import { useState } from 'react'

const MEAL_ICON = { เช้า: '🌅', กลางวัน: '☀️', เย็น: '🌆', ของว่าง: '🍎' }
const EMPTY_FORM = { name: '', mealTime: 'เช้า', cal: '', protein: '', carb: '', fat: '', fiber: '', qty: '' }

export default function MealPanel({ meals, onAdd, onRemove, onToggle }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name.trim()) return
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      mealTime: form.mealTime,
      cal: +form.cal || 0,
      protein: +form.protein || 0,
      carb: +form.carb || 0,
      fat: +form.fat || 0,
      fiber: +form.fiber || 0,
      qty: form.qty.trim(),
      done: false,
    })
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  const totalP  = meals.reduce((s, m) => s + m.protein, 0)
  const totalC  = meals.reduce((s, m) => s + m.carb, 0)
  const totalF  = meals.reduce((s, m) => s + m.fat, 0)
  const totalFi = meals.reduce((s, m) => s + m.fiber, 0)

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>🥗 แผนอาหาร</h2>
        <button className="btn btn-blue" onClick={() => setOpen(o => !o)}>+ เพิ่ม</button>
      </div>

      {open && (
        <div className="add-form">
          <div className="form-row">
            <div>
              <label>ชื่ออาหาร</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="เช่น ข้าวผัด, สลัด"
              />
            </div>
            <div>
              <label>มื้อ</label>
              <select value={form.mealTime} onChange={e => set('mealTime', e.target.value)}>
                <option value="เช้า">🌅 เช้า</option>
                <option value="กลางวัน">☀️ กลางวัน</option>
                <option value="เย็น">🌆 เย็น</option>
                <option value="ของว่าง">🍎 ของว่าง</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>แคลอรี (kcal)</label>
              <input type="number" min="0" value={form.cal} onChange={e => set('cal', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label>โปรตีน (g)</label>
              <input type="number" min="0" value={form.protein} onChange={e => set('protein', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label>คาร์บ (g)</label>
              <input type="number" min="0" value={form.carb} onChange={e => set('carb', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label>ไขมัน (g)</label>
              <input type="number" min="0" value={form.fat} onChange={e => set('fat', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>ไฟเบอร์ (g)</label>
              <input type="number" min="0" value={form.fiber} onChange={e => set('fiber', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label>ปริมาณ / หน่วย</label>
              <input value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="เช่น 1 จาน, 200g" />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => { setOpen(false); setForm(EMPTY_FORM) }}>ยกเลิก</button>
            <button className="btn btn-blue" onClick={handleSave}>บันทึก</button>
          </div>
        </div>
      )}

      <div className="item-list">
        {meals.length === 0
          ? <div className="empty-msg">ยังไม่มีรายการอาหาร</div>
          : meals.map((m, idx) => (
            <div key={m.id} className={`item${m.done ? ' done' : ''}`}>
              <div
                className={`item-check${m.done ? ' checked' : ''}`}
                onClick={() => onToggle(idx)}
              >
                {m.done ? '✓' : ''}
              </div>
              <div className="item-body">
                <div className="item-name">{m.name}</div>
                <div className="item-meta">
                  <span>{MEAL_ICON[m.mealTime] || ''} {m.mealTime}</span>
                  {m.qty && <span>{m.qty}</span>}
                  {m.protein > 0 && <span>P {m.protein}g</span>}
                  {m.carb > 0    && <span>C {m.carb}g</span>}
                  {m.fat > 0     && <span>F {m.fat}g</span>}
                </div>
              </div>
              <div className="item-right">
                {m.cal > 0 && <span className="cal-badge cal-eat">🍽 {m.cal}</span>}
                <button className="btn btn-danger" onClick={() => onRemove(idx)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>

      {meals.length > 0 && (
        <div className="macro-bar">
          <h3>สรุปสารอาหาร</h3>
          <div className="macro-row">
            <div className="macro-item">
              <div className="m-lbl">โปรตีน</div>
              <div className="m-val m-protein">{totalP}g</div>
            </div>
            <div className="macro-item">
              <div className="m-lbl">คาร์บ</div>
              <div className="m-val m-carb">{totalC}g</div>
            </div>
            <div className="macro-item">
              <div className="m-lbl">ไขมัน</div>
              <div className="m-val m-fat">{totalF}g</div>
            </div>
            <div className="macro-item">
              <div className="m-lbl">ไฟเบอร์</div>
              <div className="m-val m-fiber">{totalFi}g</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
