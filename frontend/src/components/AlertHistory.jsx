import { Thermometer, Wind, AlertTriangle, Droplets, ShieldCheck } from 'lucide-react'

const SEVERITY = {
  critical: {
    bg: 'bg-red-500/8',
    border: 'border-red-500/20',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400',
    label: 'CRITICAL',
  },
  warning: {
    bg: 'bg-yellow-500/8',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400',
    label: 'WARNING',
  },
}

const SENSOR_ICONS = {
  temperature: Thermometer,
  smoke: AlertTriangle,
  co: Wind,
  humidity: Droplets,
}

export default function AlertHistory({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-700">
        <ShieldCheck className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm font-medium text-gray-600">No alerts</p>
        <p className="text-xs mt-1 text-gray-700">All sensors within safe limits</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
      {alerts.slice(0, 10).map(alert => {
        const Icon = SENSOR_ICONS[alert.sensorKey] || AlertTriangle
        const s = SEVERITY[alert.severity] || SEVERITY.warning

        return (
          <div
            key={alert.id}
            className={`flex items-center gap-3 p-3 rounded-lg border animate-slide-in ${s.bg} ${s.border}`}
          >
            <div className={`p-1.5 rounded-md ${s.badge.split(' ')[0]} shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${s.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${s.text} truncate`}>{alert.sensorName}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {alert.value} {alert.unit}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.badge}`}>
                {s.label}
              </span>
              <p className="text-[10px] text-gray-700 mt-1">{alert.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
