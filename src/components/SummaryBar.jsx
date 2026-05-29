export default function SummaryBar({ exercises, meals, water }) {
  const burn   = exercises.reduce((s, e) => s + e.cal, 0)
  const intake = meals.reduce((s, m) => s + m.cal, 0)
  const mins   = exercises.reduce((s, e) => s + e.duration, 0)
  const net    = intake - burn

  return (
    <div className="summary-bar">
      <div className="stat-card green">
        <div className="val">{burn}</div>
        <div className="lbl">🔥 แคลเบิร์น</div>
      </div>
      <div className="stat-card blue">
        <div className="val">{intake}</div>
        <div className="lbl">🍽️ แคลรับเข้า</div>
      </div>
      <div className="stat-card orange">
        <div className="val" style={{ color: net > 0 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
          {net > 0 ? '+' : ''}{net}
        </div>
        <div className="lbl">⚖️ สุทธิ</div>
      </div>
      <div className="stat-card purple">
        <div className="val">{mins}</div>
        <div className="lbl">🏃 นาที/ออกกำลัง</div>
      </div>
      <div className="stat-card blue">
        <div className="val">{water}/8</div>
        <div className="lbl">💧 แก้วน้ำ</div>
      </div>
    </div>
  )
}
