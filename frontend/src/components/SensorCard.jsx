import { Line } from 'react-chartjs-2'

const STATUS_CONFIG = {
  normal: {
    label: 'Normal',
    border: 'border-green-500/25',
    iconBg: 'bg-green-500/10',
    iconText: 'text-green-400',
    badgeBg: 'bg-green-500/10',
    badgeText: 'text-green-400',
    dot: 'bg-green-400',
    line: '#10B981',
    pulse: false,
  },
  warning: {
    label: 'Warning',
    border: 'border-yellow-500/40',
    iconBg: 'bg-yellow-500/10',
    iconText: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10',
    badgeText: 'text-yellow-400',
    dot: 'bg-yellow-400',
    line: '#F59E0B',
    pulse: false,
  },
  critical: {
    label: 'Critical',
    border: 'border-red-500/60',
    iconBg: 'bg-red-500/15',
    iconText: 'text-red-400',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-400',
    dot: 'bg-red-500',
    line: '#EF4444',
    pulse: true,
  },
}

export default function SensorCard({ config, icon: Icon, value, status, history }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.normal

  const chartData = {
    labels: history.map(() => ''),
    datasets: [
      {
        data: history,
        borderColor: s.line,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: false,
    elements: { line: { borderJoinStyle: 'round' } },
  }

  const displayValue = config.inverse
    ? Math.max(0, Math.round(value))
    : Math.max(0, Math.round(value))

  return (
    <div
      className={`relative rounded-xl border bg-[#141414] p-5 transition-all duration-500 ${s.border} ${
        status === 'critical' ? 'animate-border-pulse' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${s.iconBg} transition-colors duration-300`}>
            <Icon className={`w-5 h-5 ${s.iconText} transition-colors duration-300`} />
          </div>
          <p className="text-xs text-gray-500 font-medium leading-snug">{config.name}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.badgeBg} transition-all duration-300`}>
          <div className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''} transition-colors duration-300`} />
          <span className={`text-xs font-semibold ${s.badgeText} tracking-wide transition-colors duration-300`}>
            {s.label}
          </span>
        </div>
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-white tabular-nums leading-none">
              {displayValue}
            </span>
            <span className="text-gray-500 text-sm font-medium">{config.unit}</span>
          </div>
          <p className="text-xs text-gray-700 mt-1.5">
            Critical: {config.inverse ? `< ${config.critical}` : `> ${config.critical}`} {config.unit}
          </p>
        </div>
        <div className="w-28 h-14 shrink-0">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
