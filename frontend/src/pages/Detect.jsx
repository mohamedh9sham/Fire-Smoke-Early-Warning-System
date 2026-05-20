import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import {
  Camera, Play, Pause, Bell, AlertTriangle, CheckCircle, Download,
} from 'lucide-react'

export default function Detect() {
  const webcamRef = useRef(null)
  const intervalRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [lastAnnotated, setLastAnnotated] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [stats, setStats] = useState({ frames: 0, fire: 0, smoke: 0 })

  const runDetection = useCallback(async () => {
    if (!webcamRef.current) return
    const screenshot = webcamRef.current.getScreenshot()
    if (!screenshot) return

    try {
      const fetchRes = await fetch(screenshot)
      const blob = await fetchRes.blob()
      const formData = new FormData()
      formData.append('file', new File([blob], 'frame.jpg', { type: 'image/jpeg' }))

      const res = await fetch('http://localhost:8000/detect', { method: 'POST', body: formData })
      const data = await res.json()

      // Prioritize fire over smoke when both appear in the detections array
      const hasFire  = data.detections?.some(d => d.class === 'fire')
      const hasSmoke = data.detections?.some(d => d.class === 'smoke')
      const priorityClass = hasFire ? 'fire' : hasSmoke ? 'smoke' : data.class
      const processed = { ...data, class: priorityClass }

      setResult(processed)
      if (processed.annotated_image_url) {
        setLastAnnotated(processed.annotated_image_url + '?t=' + Date.now())
      }
      setStats(prev => ({
        frames: prev.frames + 1,
        fire:  prev.fire  + (priorityClass === 'fire'  ? 1 : 0),
        smoke: prev.smoke + (priorityClass === 'smoke' ? 1 : 0),
      }))
    } catch {
      // Network error — silently skip this frame
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      runDetection()
      intervalRef.current = setInterval(runDetection, 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, runDetection])

  const handleDownload = () => {
    if (!lastAnnotated) return
    const a = document.createElement('a')
    a.href = lastAnnotated
    a.download = `fireguard-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const borderColor =
    result?.class === 'fire'  ? 'border-red-500' :
    result?.class === 'smoke' ? 'border-gray-400' :
    result                    ? 'border-green-500' :
                                'border-white/[0.06]'

  const glowColor =
    result?.class === 'fire'  ? 'shadow-[0_0_40px_rgba(239,68,68,0.35)]' :
    result?.class === 'smoke' ? 'shadow-[0_0_40px_rgba(156,163,175,0.25)]' :
    result                    ? 'shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''

  const badgeBg =
    result?.class === 'fire'  ? 'bg-red-500 text-white' :
    result?.class === 'smoke' ? 'bg-gray-600 text-white' :
                                'bg-green-600 text-white'

  const statusColor =
    result?.class === 'fire'  ? 'text-red-400' :
    result?.class === 'smoke' ? 'text-gray-300' :
                                'text-green-400'

  return (
    <div className="relative min-h-screen bg-[#0F0F0F]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">
              Live Detection — Powered by YOLOv8
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Live Camera Detection
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real-time AI-powered fire and smoke detection from your camera feed
          </p>
        </div>

        {/* Main grid: camera | result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Live camera feed ── */}
          <div className="space-y-4">
            <div
              className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-500 ${borderColor} ${glowColor}`}
            >
              {/* Pulsing alert ring */}
              {result?.detected && (
                <div className="absolute -inset-px rounded-2xl border-2 border-red-500 animate-pulse pointer-events-none z-10" />
              )}

              {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] gap-4">
                  <Camera className="w-16 h-16 text-white/15" />
                  <p className="text-white/30 text-sm text-center px-8">{cameraError}</p>
                </div>
              ) : (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.85}
                  className="w-full h-full object-cover"
                  onUserMediaError={() =>
                    setCameraError(
                      'Camera access denied. Allow camera permissions in your browser and reload the page.'
                    )
                  }
                />
              )}

              {/* REC badge */}
              {isRunning && !cameraError && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-red-400 tracking-widest">REC</span>
                </div>
              )}

              {/* Status badge */}
              {result && (
                <div className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badgeBg}`}>
                  {result.detected
                    ? result.class === 'fire'
                      ? <Bell className="w-3 h-3" />
                      : <AlertTriangle className="w-3 h-3" />
                    : <CheckCircle className="w-3 h-3" />
                  }
                  {result.detected ? `${result.class.toUpperCase()} DETECTED` : 'SAFE'}
                  {' · '}{(result.confidence * 100).toFixed(0)}%
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsRunning(v => !v)}
                disabled={!!cameraError}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isRunning
                    ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Stop Detection' : 'Start Detection'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!lastAnnotated}
                title="Download last annotated frame"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Snapshot
              </button>
            </div>
          </div>

          {/* ── Annotated result ── */}
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/[0.06]">
              {lastAnnotated ? (
                <img
                  src={lastAnnotated}
                  alt="Annotated detection result"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <AlertTriangle className="w-14 h-14 text-white/10" />
                  <p className="text-white/20 text-sm">Annotated result appears here</p>
                  <p className="text-white/12 text-xs">Start detection to analyze frames</p>
                </div>
              )}
              {result && lastAnnotated && (
                <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-mono text-white/40">
                    {result.detections?.length || 0} object(s) · {(result.confidence * 100).toFixed(1)}% conf
                  </span>
                </div>
              )}
            </div>

            {/* Detection details panel */}
            <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.06]">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-4">
                Last Detection Result
              </p>
              {result ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`text-sm font-bold ${statusColor}`}>
                      {result.detected ? `${result.class.toUpperCase()} DETECTED` : 'SAFE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Confidence</span>
                    <span className="text-white text-sm font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Objects detected</span>
                    <span className="text-white text-sm font-mono">
                      {result.detections?.length ?? 0}
                    </span>
                  </div>
                  {result.detections?.length > 0 && (
                    <div className="pt-2.5 border-t border-white/5 space-y-1.5">
                      {result.detections.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${d.class === 'fire' ? 'text-red-400' : 'text-gray-400'}`}>
                            {d.class.toUpperCase()} #{i + 1}
                          </span>
                          <span className="text-gray-600 font-mono">
                            {(d.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No results yet — start detection above</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Frames Analyzed', value: stats.frames, color: 'text-blue-400' },
            { label: 'Fire Alerts',     value: stats.fire,   color: 'text-red-400' },
            { label: 'Smoke Alerts',    value: stats.smoke,  color: 'text-gray-300' },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#141414] border border-white/[0.06]"
            >
              <span className={`text-4xl font-extrabold ${s.color} mb-1 tabular-nums`}>
                {s.value}
              </span>
              <span className="text-gray-500 text-xs font-medium">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
