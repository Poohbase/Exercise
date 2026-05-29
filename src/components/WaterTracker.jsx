export default function WaterTracker({ water, onSet }) {
  const handleClick = (i) => {
    onSet(i < water ? i : i + 1)
  }

  return (
    <div className="water-panel">
      <div className="water-header">
        <h2>💧 น้ำดื่มประจำวัน</h2>
        <span className="water-count">{water} / 8 แก้ว</span>
      </div>
      <div className="glass-row">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`glass${i < water ? ' filled' : ''}`}
            title={`แก้วที่ ${i + 1}`}
            onClick={() => handleClick(i)}
          >
            🥤
          </div>
        ))}
      </div>
      <div className="water-info">เป้าหมาย 8 แก้ว (≈ 2 ลิตร) คลิกที่แก้วเพื่อบันทึก</div>
    </div>
  )
}
