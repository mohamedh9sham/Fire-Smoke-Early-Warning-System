import { useState, useEffect, useRef } from 'react'
import {
  Thermometer, Wind, AlertTriangle, Droplets,
  X, Volume2, VolumeX, Activity, Cpu,
} from 'lucide-react'
import SensorCard from '../components/SensorCard'
import SensorChart from '../components/SensorChart'
import AlertHistory from '../components/AlertHistory'

/* ─── Constants ─────────────────────────────────────────────────────────── */

const CARD_HIST = 30
const CHART_HIST = 60

const THRESHOLDS = {
  temperature: { warning: 35, critical: 60, unit: '°C',  name: 'Temperature (DHT22)', inverse: false },
  smoke:       { warning: 100, critical: 300, unit: 'ppm', name: 'Smoke Sensor (MQ-2)',  inverse: false },
  co:          { warning: 50,  critical: 200, unit: 'ppm', name: 'CO Sensor (MQ-7)',     inverse: false },
  humidity:    { warning: 30,  critical: 15,  unit: '%',   name: 'Humidity (DHT22)',     inverse: true  },
}

const ICONS = {
  temperature: Thermometer,
  smoke: AlertTriangle,
  co: Wind,
  humidity: Droplets,
}

const SENSOR_KEYS = ['temperature', 'smoke', 'co', 'humidity']

const INITIAL = { temperature: 24, smoke: 45, co: 18, humidity: 65 }

const TARGETS = {
  normal: { temperature: 24,  smoke: 45,  co: 18,  humidity: 65 },
  fire:   { temperature: 78,  smoke: 450, co: 280, humidity: 12 },
  smoke:  { temperature: 28,  smoke: 360, co: 230, humidity: 58 },
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getStatus(key, value) {
  const t = THRESHOLDS[key]
  if (t.inverse) {
    if (value <= t.critical) return 'critical'
    if (value <= t.warning)  return 'warning'
    return 'normal'
  }
  if (value >= t.critical) return 'critical'
  if (value >= t.warning)  return 'warning'
  return 'normal'
}

function dangerPct(key, value) {
  const t = THRESHOLDS[key]
  if (t.inverse) {
    return Math.max(0, Math.min(100, ((70 - value) / 55) * 100))
  }
  return Math.max(0, Math.min(100, (value / t.critical) * 100))
}

function initCardHist() {
  return Object.fromEntries(SENSOR_KEYS.map(k => [k, Array(CARD_HIST).fill(INITIAL[k])]))
}

function initChartHist() {
  return {
    labels: Array(CHART_HIST).fill(''),
    ...Object.fromEntries(SENSOR_KEYS.map(k => [k, Array(CHART_HIST).fill(dangerPct(k, INITIAL[k]))]))
  }
}

/* ─── System status config ───────────────────────────────────────────────── */

const SYS_STATUS = {
  normal: {
    label: 'SYSTEM NORMAL',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    dot: 'bg-green-400',
    pulse: false,
  },
  warning: {
    label: 'WARNING',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
    pulse: true,
  },
  critical: {
    label: 'DANGER — FIRE ALERT',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
    pulse: true,
  },
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Monitoring() {
  const [showBanner, setShowBanner]       = useState(true)
  const [scenario, setScenario]           = useState('normal')
  const [sensors, setSensors]             = useState({ ...INITIAL })
  const [cardHist, setCardHist]           = useState(initCardHist)
  const [chartHist, setChartHist]         = useState(initChartHist)
  const [alerts, setAlerts]               = useState([])
  const [soundEnabled, setSoundEnabled]   = useState(false)
  const [tick, setTick]                   = useState(0)

  const sensorsRef    = useRef({ ...INITIAL })
  const targetsRef    = useRef({ ...INITIAL })
  const alertedRef    = useRef({})
  const alertIdRef    = useRef(0)
  const soundRef      = useRef(false)
  const audioCtxRef   = useRef(null)

  /* Keep sound ref in sync */
  soundRef.current = soundEnabled

  /* Beep */
  const playBeep = () => {
    if (!soundRef.current) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch (_) { /* audio unavailable */ }
  }

  /* Scenario handler */
  const handleScenario = (next) => {
    if (next === 'reset') {
      targetsRef.current  = { ...INITIAL }
      sensorsRef.current  = { ...INITIAL }
      alertedRef.current  = {}
      setSensors({ ...INITIAL })
      setCardHist(initCardHist())
      setChartHist(initChartHist())
      setAlerts([])
      setScenario('normal')
    } else {
      targetsRef.current = { ...TARGETS[next] }
      setScenario(next)
    }
  }

  /* Simulation loop */
  useEffect(() => {
    const id = setInterval(() => {
      const prev    = sensorsRef.current
      const targets = targetsRef.current
      const next    = {}

      SENSOR_KEYS.forEach(k => {
        const diff  = targets[k] - prev[k]
        const speed = 0.06 + Math.random() * 0.04
        const noise = (Math.random() - 0.5) * (Math.abs(diff) > 20 ? 4 : 1.5)
        let val = prev[k] + diff * speed + noise
        val = k === 'humidity'
          ? Math.max(5, Math.min(100, val))
          : Math.max(0, val)
        next[k] = val
      })

      sensorsRef.current = next
      setSensors({ ...next })
      setTick(t => t + 1)

      /* Alert detection */
      SENSOR_KEYS.forEach(k => {
        const st = getStatus(k, next[k])

        if (st === 'critical' && !alertedRef.current[k]) {
          alertedRef.current[k] = true
          const id2 = ++alertIdRef.current
          const time = new Date().toLocaleTimeString()
          setAlerts(prev => [
            { id: id2, sensorKey: k, sensorName: THRESHOLDS[k].name, value: Math.round(next[k]), unit: THRESHOLDS[k].unit, severity: 'critical', time },
            ...prev.slice(0, 9),
          ])
          playBeep()
        } else if (st === 'warning' && !alertedRef.current[`${k}_w`]) {
          alertedRef.current[`${k}_w`] = true
          const id2 = ++alertIdRef.current
          const time = new Date().toLocaleTimeString()
          setAlerts(prev => [
            { id: id2, sensorKey: k, sensorName: THRESHOLDS[k].name, value: Math.round(next[k]), unit: THRESHOLDS[k].unit, severity: 'warning', time },
            ...prev.slice(0, 9),
          ])
        }

        if (st !== 'critical') alertedRef.current[k]       = false
        if (st === 'normal')   alertedRef.current[`${k}_w`] = false
      })

      /* Histories */
      const label = new Date().toLocaleTimeString('en-US', { hour12: false })

      setCardHist(h => Object.fromEntries(
        SENSOR_KEYS.map(k => [k, [...h[k].slice(1), next[k]]])
      ))

      setChartHist(h => ({
        labels: [...h.labels.slice(1), label],
        ...Object.fromEntries(SENSOR_KEYS.map(k => [k, [...h[k].slice(1), dangerPct(k, next[k])]]))
      }))
    }, 1000)

    return () => clearInterval(id)
  }, []) /* intentionally empty — refs track mutable state */

  /* Derived system status */
  const sysStatus = (() => {
    const ss = SENSOR_KEYS.map(k => getStatus(k, sensors[k]))
    if (ss.some(s => s === 'critical')) return 'critical'
    if (ss.some(s => s === 'warning'))  return 'warning'
    return 'normal'
  })()

  const sys = SYS_STATUS[sysStatus]

  /* Scenario button styles */
  const scenBtn = (name, activeColor, activeClass, hoverClass, borderClass) =>
    `px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
      scenario === name
        ? activeClass
        : `${borderClass} ${activeColor} ${hoverClass}`
    }`

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Demo Banner ── */}
        {showBanner && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/25 animate-slide-in">
            <span className="text-blue-400 text-base shrink-0 mt-0.5">💡</span>
            <p className="text-blue-300/80 text-sm flex-1 leading-relaxed">
              <span className="font-semibold text-blue-300">Demo Mode:</span> This dashboard uses simulated sensor data to demonstrate the system's alerting capabilities.
              Real IoT hardware integration (ESP32 + DHT22 + MQ-2 + MQ-7) is planned for production deployment.
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="text-blue-500 hover:text-blue-300 transition-colors shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Live Sensor Monitoring</h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time multi-sensor analysis simulating IoT-connected detectors
            </p>
          </div>

          {/* System status */}
          <div className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border ${sys.border} ${sys.bg} transition-all duration-500`}>
            <div className={`w-2.5 h-2.5 rounded-full ${sys.dot} ${sys.pulse ? 'animate-pulse' : ''} transition-colors duration-500`} />
            <span className={`font-bold text-sm tracking-wider ${sys.color} transition-colors duration-500`}>
              {sysStatus === 'critical' ? '🔴' : sysStatus === 'warning' ? '🟡' : '🟢'} {sys.label}
            </span>
          </div>
        </div>

        {/* ── Scenario Panel ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-[#141414] border border-white/[0.06]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleScenario('normal')}
              className={scenBtn('normal', 'text-green-400', 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]', 'hover:bg-green-500/10', 'border-green-500/30')}
            >
              ✓ Normal
            </button>
            <button
              onClick={() => handleScenario('fire')}
              className={scenBtn('fire', 'text-red-400', 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]', 'hover:bg-red-500/10', 'border-red-500/30')}
            >
              🔥 Fire Scenario
            </button>
            <button
              onClick={() => handleScenario('smoke')}
              className={scenBtn('smoke', 'text-orange-400', 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]', 'hover:bg-orange-500/10', 'border-orange-500/30')}
            >
              💨 Smoke Scenario
            </button>
            <button
              onClick={() => handleScenario('reset')}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-500 hover:text-white hover:bg-white/5 hover:border-gray-500 transition-all duration-200"
            >
              ↺ Reset
            </button>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              soundEnabled
                ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                : 'border-gray-700 text-gray-600 hover:text-gray-400 hover:border-gray-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>

        {/* ── Sensor Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {SENSOR_KEYS.map(k => (
            <SensorCard
              key={k}
              config={THRESHOLDS[k]}
              icon={ICONS[k]}
              value={sensors[k]}
              status={getStatus(k, sensors[k])}
              history={cardHist[k]}
            />
          ))}
        </div>

        {/* ── Main Chart + Alert History ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Live chart */}
          <div className="lg:col-span-2 rounded-xl bg-[#141414] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-white">Danger Level Trends</h2>
                <p className="text-xs text-gray-600 mt-0.5">% of critical threshold — last 60 seconds</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Live · {tick}s</span>
              </div>
            </div>
            <SensorChart data={chartHist} />

            {/* Legend hint */}
            <p className="text-[11px] text-gray-700 text-center mt-3">
              Values above 100% indicate sensor has exceeded the critical threshold
            </p>
          </div>

          {/* Alert history */}
          <div className="rounded-xl bg-[#141414] border border-white/[0.06] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h2 className="font-semibold text-white">Alert History</h2>
              </div>
              <div className="flex items-center gap-2">
                {alerts.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                    {alerts.length}
                  </span>
                )}
                {alerts.length > 0 && (
                  <button
                    onClick={() => { setAlerts([]); alertedRef.current = {} }}
                    className="text-xs text-gray-700 hover:text-gray-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AlertHistory alerts={alerts} />
            </div>
          </div>
        </div>

        {/* ── Sensor reference ── */}
        <div className="rounded-xl bg-[#141414] border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gray-600" />
            Sensor Thresholds Reference
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SENSOR_KEYS.map(k => {
              const t = THRESHOLDS[k]
              const Icon = ICONS[k]
              return (
                <div key={k} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-xs text-gray-500 font-medium">{t.name}</span>
                  </div>
                  <div className="space-y-1 text-xs pl-5">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Normal</span>
                      <span className="text-green-500 font-mono">
                        {t.inverse ? `> ${t.warning}` : `< ${t.warning}`} {t.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Warning</span>
                      <span className="text-yellow-500 font-mono">
                        {t.inverse ? `${t.critical}–${t.warning}` : `${t.warning}–${t.critical}`} {t.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Critical</span>
                      <span className="text-red-400 font-mono">
                        {t.inverse ? `< ${t.critical}` : `> ${t.critical}`} {t.unit}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
