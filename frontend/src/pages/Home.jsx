import { Link } from 'react-router-dom'
import {
  Brain, Activity, Bell, ArrowRight, Camera, Cpu, Siren,
  CheckCircle2, Target, Clock, Shield, Flame,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    title: 'AI-Powered Detection',
    desc: 'YOLOv8 deep learning model being trained on 10,000+ annotated fire and smoke images for >95% detection accuracy.',
  },
  {
    icon: Activity,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    title: 'Real-Time Monitoring',
    desc: 'Live IoT sensor integration with ESP32 + DHT22 + MQ-2 + MQ-7 for continuous threshold-based environmental alerting.',
  },
  {
    icon: Bell,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]',
    title: 'Smart Notifications',
    desc: 'Instant multi-channel alerts via visual indicators, audio alarms, snapshot capture, and external notification dispatch.',
  },
]

const steps = [
  {
    icon: Camera,
    num: '01',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/20',
    title: 'Capture',
    desc: 'Camera feed and IoT sensors continuously capture the environment in real-time.',
  },
  {
    icon: Cpu,
    num: '02',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    ring: 'ring-orange-500/20',
    title: 'Analyze',
    desc: 'YOLOv8 model analyzes frames while sensor data is cross-referenced against thresholds.',
  },
  {
    icon: Siren,
    num: '03',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    ring: 'ring-yellow-500/20',
    title: 'Alert',
    desc: 'Instant multi-channel alerts are dispatched with location, snapshot, and severity data.',
  },
]

const stats = [
  { value: '95%', label: 'Target Accuracy', icon: Target, color: 'text-red-400' },
  { value: '<1s', label: 'Detection Time', icon: Clock, color: 'text-orange-400' },
  { value: '24/7', label: 'Continuous Monitoring', icon: Shield, color: 'text-blue-400' },
]

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-48 bg-gradient-to-b from-red-500/30 to-transparent pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-medium">
            ⚡ Live AI Detection — Powered by YOLOv8
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
          <span className="gradient-text">Fire &amp; Smoke</span>
          <br />
          <span className="text-white">Early Warning System</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          A fully operational AI-powered fire and smoke detection system.
          Point your camera at a scene and get real-time YOLOv8 detections with bounding boxes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/detect"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
          >
            <Flame className="w-4 h-4" />
            Open Live Detection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/monitoring"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 text-orange-400 font-semibold text-sm transition-all duration-200"
          >
            <Activity className="w-4 h-4" />
            Try Live Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating orbs */}
        <div className="absolute -top-10 -left-20 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-20 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Core Capabilities</h2>
          <p className="text-gray-500">Designed for enterprise-grade fire safety</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className={`group relative rounded-2xl bg-[#141414] border ${f.border} p-7 card-hover transition-all duration-300 ${f.glow}`}
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-gray-500">Three steps from detection to alert</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center text-center">
              <div className={`relative w-20 h-20 rounded-2xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center mb-5 shadow-lg`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
                <span className={`absolute -top-2.5 -right-2.5 text-[10px] font-bold ${step.color} bg-[#0F0F0F] border border-current rounded-full w-6 h-6 flex items-center justify-center leading-none`}>
                  {idx + 1}
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#141414] border border-white/[0.06] card-hover"
            >
              <s.icon className={`w-6 h-6 ${s.color} mb-4 opacity-80`} />
              <span className={`text-5xl font-extrabold ${s.color} stat-glow`}>{s.value}</span>
              <span className="text-gray-500 text-sm mt-2 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Project Info ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center py-8 border-t border-white/[0.05]">
          <div className="flex flex-wrap items-center justify-center gap-2 text-gray-600 text-sm">
            <span className="text-gray-500 font-medium">WEX 428 (WorkPlace)</span>
            <span>·</span>
            <span>OSTIM Technical University</span>
            <span>·</span>
            <span>Software Engineering</span>
            <span>·</span>
            <span>Group 13</span>
            <span>·</span>
            <span>Submission: <span className="text-gray-500">June 5, 2026</span></span>
          </div>
        </div>
      </section>
    </div>
  )
}
