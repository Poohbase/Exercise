export default function Header({ currentDate, onPrev, onNext, onDateChange }) {
  return (
    <header>
      <h1>💪 วางแผน<span>สุขภาพ</span>ประจำวัน</h1>
      <div className="date-nav">
        <button onClick={onPrev} title="วันก่อนหน้า">‹</button>
        <input
          type="date"
          value={currentDate}
          onChange={e => onDateChange(e.target.value)}
        />
        <button onClick={onNext} title="วันถัดไป">›</button>
      </div>
    </header>
  )
}
