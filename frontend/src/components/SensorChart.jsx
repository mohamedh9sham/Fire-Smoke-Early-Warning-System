import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

const DATASETS_CONFIG = [
  { key: 'temperature', label: 'Temperature', color: '#EF4444' },
  { key: 'smoke',       label: 'Smoke (MQ-2)',  color: '#F97316' },
  { key: 'co',          label: 'CO (MQ-7)',     color: '#F59E0B' },
  { key: 'humidity',    label: 'Humidity Risk', color: '#3B82F6' },
]

export default function SensorChart({ data }) {
  const chartData = useMemo(() => ({
    labels: data.labels,
    datasets: DATASETS_CONFIG.map(({ key, label, color }) => ({
      label,
      data: data[key],
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: false,
    })),
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#9CA3AF',
          boxWidth: 10,
          boxHeight: 2,
          padding: 16,
          font: { size: 11, family: 'Inter' },
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#F3F4F6',
        bodyColor: '#9CA3AF',
        padding: 12,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#4B5563',
          maxTicksLimit: 8,
          font: { size: 10, family: 'Inter' },
          maxRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#4B5563',
          font: { size: 10, family: 'Inter' },
          callback: v => `${v}%`,
          stepSize: 25,
        },
      },
    },
    animation: false,
    elements: { line: { borderJoinStyle: 'round' } },
  }), [])

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
}
