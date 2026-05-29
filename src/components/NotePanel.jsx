import { useState, useEffect } from 'react'

export default function NotePanel({ note, onSave }) {
  const [text, setText] = useState(note)

  useEffect(() => { setText(note) }, [note])

  return (
    <div className="note-panel">
      <h2>📝 บันทึกประจำวัน</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="จดบันทึก ความรู้สึก เป้าหมาย หรือข้อสังเกตของวันนี้..."
      />
      <div className="note-actions">
        <button className="btn btn-ghost" onClick={() => onSave(text)}>บันทึก</button>
      </div>
    </div>
  )
}
