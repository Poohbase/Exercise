export default function Header({ currentDate, onPrev, onNext, onDateChange, onExport, onImport }) {
  return (
    <header>
      <div className="header-logo-section">
        <h1>💪 วางแผน<span>สุขภาพ</span>ประจำวัน</h1>
        <div className="header-actions">
          <button className="header-btn" onClick={onExport} title="ส่งออกไฟล์ข้อมูลไปเปิดที่เครื่องอื่น">
            📥 ส่งออกข้อมูล
          </button>
          <label className="header-btn file-input-label" title="นำเข้าไฟล์ข้อมูลจากเครื่องอื่น">
            📤 นำเข้าข้อมูล
            <input type="file" accept=".json" onChange={onImport} />
          </label>
        </div>
      </div>
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
