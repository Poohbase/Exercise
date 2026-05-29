import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
)

ChartJS.defaults.color = '#e2e8f0'
ChartJS.defaults.font.family = "'Segoe UI', system-ui, sans-serif"
ChartJS.defaults.font.size = 11

const GRID = 'rgba(255,255,255,0.06)'

function getLast7Days(anchor) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

function shortDate(str) {
  const d = new Date(str)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export default function ChartsSection({ currentDate, data }) {
  const days7  = getLast7Days(currentDate)
  const labels = days7.map(shortDate)

  const today = data[currentDate] ?? { exercises: [], meals: [] }

  const burnData   = days7.map(d => (data[d]?.exercises ?? []).reduce((s, e) => s + e.cal, 0))
  const intakeData = days7.map(d => (data[d]?.meals ?? []).reduce((s, m) => s + m.cal, 0))
  const minsData   = days7.map(d => (data[d]?.exercises ?? []).reduce((s, e) => s + e.duration, 0))

  const totalP  = today.meals.reduce((s, m) => s + m.protein, 0)
  const totalC  = today.meals.reduce((s, m) => s + m.carb, 0)
  const totalF  = today.meals.reduce((s, m) => s + m.fat, 0)
  const totalFi = today.meals.reduce((s, m) => s + m.fiber, 0)
  const macroHas = totalP + totalC + totalF + totalFi > 0

  const typeMap = { cardio: 0, strength: 0, stretch: 0, other: 0 }
  today.exercises.forEach(e => { typeMap[e.type] = (typeMap[e.type] || 0) + (e.duration || 0) })
  const typeHas = Object.values(typeMap).some(v => v > 0)

  const GREY = 'rgba(46,51,80,0.6)'

  const calWeekData = {
    labels,
    datasets: [
      {
        label: 'รับเข้า (kcal)',
        data: intakeData,
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'เผาผลาญ (kcal)',
        data: burnData,
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  }

  const calWeekOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { color: GRID } },
      y: { grid: { color: GRID }, beginAtZero: true },
    },
  }

  const macroPieData = {
    labels: ['โปรตีน (g)', 'คาร์บ (g)', 'ไขมัน (g)', 'ไฟเบอร์ (g)'],
    datasets: [{
      data: macroHas ? [totalP, totalC, totalF, totalFi] : [1, 1, 1, 1],
      backgroundColor: macroHas
        ? ['rgba(59,130,246,0.8)', 'rgba(249,115,22,0.8)', 'rgba(168,85,247,0.8)', 'rgba(34,197,94,0.8)']
        : [GREY, GREY, GREY, GREY],
      borderColor: '#1a1d27',
      borderWidth: 2,
    }],
  }

  const donutOpts = (getLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
      tooltip: { callbacks: { label: getLabel } },
    },
  })

  const minsWeekData = {
    labels,
    datasets: [{
      label: 'นาที',
      data: minsData,
      borderColor: '#a855f7',
      backgroundColor: 'rgba(168,85,247,0.15)',
      borderWidth: 2,
      pointBackgroundColor: '#a855f7',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: true,
    }],
  }

  const minsWeekOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} นาที` } },
    },
    scales: {
      x: { grid: { color: GRID } },
      y: { grid: { color: GRID }, min: 0, ticks: { callback: v => v + ' น.' } },
    },
  }

  const exTypeData = {
    labels: ['Cardio', 'Strength', 'Stretch / Yoga', 'อื่น ๆ'],
    datasets: [{
      data: typeHas
        ? [typeMap.cardio, typeMap.strength, typeMap.stretch, typeMap.other]
        : [1, 1, 1, 1],
      backgroundColor: typeHas
        ? ['rgba(59,130,246,0.8)', 'rgba(168,85,247,0.8)', 'rgba(34,197,94,0.8)', 'rgba(249,115,22,0.8)']
        : [GREY, GREY, GREY, GREY],
      borderColor: '#1a1d27',
      borderWidth: 2,
    }],
  }

  return (
    <div className="charts-section">
      <div className="charts-heading">📊 กราฟสรุป</div>
      <div className="charts-grid">

        <div className="chart-card">
          <h3>🔥 แคลอรี 7 วันล่าสุด (kcal)</h3>
          <div className="chart-wrap">
            <Bar data={calWeekData} options={calWeekOpts} />
          </div>
        </div>

        <div className="chart-card">
          <h3>🥦 สัดส่วน Macros วันนี้</h3>
          <div className="chart-wrap donut">
            <Doughnut
              data={macroPieData}
              options={donutOpts(ctx =>
                macroHas ? ` ${ctx.label}: ${ctx.parsed}g` : ' ยังไม่มีข้อมูล'
              )}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>🏃 นาทีออกกำลัง 7 วันล่าสุด</h3>
          <div className="chart-wrap">
            <Line data={minsWeekData} options={minsWeekOpts} />
          </div>
        </div>

        <div className="chart-card">
          <h3>🏋️ ประเภทออกกำลังกายวันนี้ (นาที)</h3>
          <div className="chart-wrap donut">
            <Doughnut
              data={exTypeData}
              options={donutOpts(ctx =>
                typeHas ? ` ${ctx.label}: ${ctx.parsed} นาที` : ' ยังไม่มีข้อมูล'
              )}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
