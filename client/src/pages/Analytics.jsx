import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── per-range datasets ─────────────────────────────────────────────────────
const rangeData = {
  daily: {
    labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm'],
    current: [2, 5, 9, 7, 6, 4, 1],
    previous: [1, 3, 6, 5, 4, 3, 2],
    maxVal: 12,
    peakLabel: '10 AM',
    peakValue: 9,
    productivity: 74, prodTrend: '+3%',
    credibility: 89, credTrend: '+1.1%',
    burnout: 'Low', burnoutColor: 'emerald',
    effort: [
      { label: 'Work', pct: 50, prev: 48, color: 'bg-indigo-500', text: 'text-indigo-600' },
      { label: 'Learning', pct: 22, prev: 24, color: 'bg-violet-400', text: 'text-violet-600' },
      { label: 'Health', pct: 18, prev: 16, color: 'bg-emerald-400', text: 'text-emerald-600' },
      { label: 'Social', pct: 10, prev: 12, color: 'bg-amber-400', text: 'text-amber-600' },
    ],
    bottomStats: [
      { icon: '⏱️', label: 'Focus Time', value: '4.2h' },
      { icon: '✅', label: 'Tasks Done', value: '18' },
      { icon: '🔥', label: 'Streak', value: '7 days' },
      { icon: '🎯', label: 'Goals Met', value: '2 / 3' },
    ],
    updated: 'Today · 5:08 AM',
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    current: [10, 14, 18, 26, 20, 14, 8],
    previous: [8, 12, 15, 14, 16, 12, 10],
    maxVal: 28,
    peakLabel: 'Thursday',
    peakValue: 26,
    productivity: 88, prodTrend: '+8%',
    credibility: 94, credTrend: '+2.4%',
    burnout: 'Medium', burnoutColor: 'amber',
    effort: [
      { label: 'Work', pct: 45, prev: 41, color: 'bg-indigo-500', text: 'text-indigo-600' },
      { label: 'Learning', pct: 25, prev: 28, color: 'bg-violet-400', text: 'text-violet-600' },
      { label: 'Health', pct: 20, prev: 18, color: 'bg-emerald-400', text: 'text-emerald-600' },
      { label: 'Social', pct: 10, prev: 13, color: 'bg-amber-400', text: 'text-amber-600' },
    ],
    bottomStats: [
      { icon: '⏱️', label: 'Focus Time', value: '32.5h' },
      { icon: '✅', label: 'Tasks Done', value: '142' },
      { icon: '🔥', label: 'Avg Streak', value: '8 days' },
      { icon: '🎯', label: 'Goals Met', value: '4 / 5' },
    ],
    updated: 'Mon, 24 Feb 2026 · 5:08 AM',
  },
  monthly: {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    current: [68, 82, 91, 88],
    previous: [55, 70, 78, 80],
    maxVal: 100,
    peakLabel: 'Week 3',
    peakValue: 91,
    productivity: 91, prodTrend: '+14%',
    credibility: 96, credTrend: '+4.1%',
    burnout: 'High', burnoutColor: 'rose',
    effort: [
      { label: 'Work', pct: 42, prev: 39, color: 'bg-indigo-500', text: 'text-indigo-600' },
      { label: 'Learning', pct: 30, prev: 26, color: 'bg-violet-400', text: 'text-violet-600' },
      { label: 'Health', pct: 17, prev: 21, color: 'bg-emerald-400', text: 'text-emerald-600' },
      { label: 'Social', pct: 11, prev: 14, color: 'bg-amber-400', text: 'text-amber-600' },
    ],
    bottomStats: [
      { icon: '⏱️', label: 'Focus Time', value: '128h' },
      { icon: '✅', label: 'Tasks Done', value: '534' },
      { icon: '🔥', label: 'Best Streak', value: '21 days' },
      { icon: '🎯', label: 'Goals Met', value: '9 / 11' },
    ],
    updated: 'Feb 2026 — full month',
  },
}

// ─── static data (unchanged) ─────────────────────────────────────────────────
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const thisWeek = [10, 14, 18, 26, 20, 14, 8]   // Thu is peak
const lastWeek = [8, 12, 15, 14, 16, 12, 10]
const maxVal = 28
const peakIndex = thisWeek.indexOf(Math.max(...thisWeek))   // 3 → Thu

const effortData = [
  { label: 'Work', pct: 45, prev: 41, color: 'bg-indigo-500', text: 'text-indigo-600' },
  { label: 'Learning', pct: 25, prev: 28, color: 'bg-violet-400', text: 'text-violet-600' },
  { label: 'Health', pct: 20, prev: 18, color: 'bg-emerald-400', text: 'text-emerald-600' },
  { label: 'Social', pct: 10, prev: 13, color: 'bg-amber-400', text: 'text-amber-600' },
]

const aiInsights = [
  {
    id: 'peak',
    accent: 'border-indigo-400 bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    tagColor: 'bg-indigo-100 text-indigo-700',
    tag: 'Optimization',
    title: 'Peak Focus Optimization',
    desc: 'Your performance peaks between 9 AM and 11 AM. Move your "Main Goal" deep work sessions to this window for a 24% higher output.',
    cta: 'Apply to Schedule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    full: true,
  },
  {
    id: 'burnout',
    accent: 'border-amber-400 bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    tagColor: 'bg-amber-100 text-amber-700',
    tag: 'Burnout Warning',
    title: 'Burnout Prevention',
    desc: 'Focus streaks exceeding 3 hours are causing a drop in your Credibility Score later in the day.',
    cta: 'View Breaks',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  {
    id: 'goal',
    accent: 'border-emerald-400 bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    tagColor: 'bg-emerald-100 text-emerald-700',
    tag: 'Goal Alignment',
    title: 'Goal Alignment Strong',
    desc: "You're hitting 92% of work subtasks. Consider increasing goal difficulty by 10%.",
    cta: 'Adjust Goals',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'efficiency',
    accent: 'border-purple-400 bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    tagColor: 'bg-purple-100 text-purple-700',
    tag: 'Efficiency',
    title: 'Learning Takes Longer',
    desc: 'Tasks tagged "Learning" run 15% over estimate. Try breaking them into 25-min chunks.',
    cta: 'Restructure Tasks',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

// SVG constants — W/H fixed; px/py computed per-render inside component
const W = 560; const H = 140

// ─── TrendArrow ───────────────────────────────────────────────────────────────
function TrendArrow({ delta }) {
  if (delta === 0) return null
  return delta > 0 ? (
    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-xs">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
      +{delta}%
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 text-rose-500 font-semibold text-xs">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      {delta}%
    </span>
  )
}

// ─── Analytics ────────────────────────────────────────────────────────────────
const Analytics = () => {
  const navigate = useNavigate()
  const [range, setRange] = useState('weekly')
  const ranges = ['daily', 'weekly', 'monthly']

  const d = rangeData[range]
  const n = d.labels.length
  const px = (i) => n > 1 ? (i / (n - 1)) * W : W / 2
  const py = (v) => H - (v / d.maxVal) * H
  const peakIndex = d.current.indexOf(Math.max(...d.current))

  const thisPoints = d.current.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  const lastPoints = d.previous.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  const areaPath = `M${px(0)},${py(d.current[0])} ${d.current.map((v, i) => `L${px(i)},${py(v)}`).join(' ')} L${px(n - 1)},${H} L${px(0)},${H} Z`

  const heroInsight = aiInsights.find(a => a.full)
  const subInsights = aiInsights.filter(a => !a.full)

  const burnoutPill = {
    Low: { pill: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-400', bg: 'bg-white', label: 'Low Risk', num: 'text-emerald-700' },
    Medium: { pill: 'bg-amber-200   text-amber-800', border: 'border-l-amber-400', bg: 'bg-amber-50', label: 'Medium Risk', num: 'text-amber-700' },
    High: { pill: 'bg-red-100    text-red-700', border: 'border-l-red-400', bg: 'bg-red-50', label: 'High Risk', num: 'text-red-700' },
  }
  const bs = burnoutPill[d.burnout] ?? burnoutPill.Medium

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto bg-gray-50 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Page title + toggle ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Performance Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Deep insights into your productivity, focus, and well-being.</p>
          </div>

          {/* Pill toggle */}
          <div className="flex items-center self-start sm:self-auto bg-white border border-gray-200 rounded-xl p-1 shadow-sm" role="tablist" aria-label="Time range">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                role="tab"
                aria-selected={range === r}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${range === r ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Hero — Productivity Score */}
          <article className="sm:col-span-1 bg-white rounded-2xl border border-gray-100 border-l-4 border-l-indigo-500 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                {d.prodTrend} vs prev
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Productivity Score</p>
            <p className="text-5xl font-extrabold text-gray-900 leading-none mb-2">{d.productivity}</p>
            <p className="text-xs text-gray-400">Based on task complexity &amp; completion speed</p>
          </article>

          {/* Secondary — Credibility Score */}
          <article className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-purple-400 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                {d.credTrend}
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Credibility Score</p>
            <p className="text-4xl font-extrabold text-gray-900 leading-none mb-2">{d.credibility}%</p>
            <p className="text-xs text-gray-400">How often you complete planned tasks</p>
          </article>

          {/* Burnout Risk — dynamic */}
          <article className={`rounded-2xl border border-gray-100 border-l-4 ${bs.border} ${bs.bg} p-5 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${bs.pill}`}>{bs.label}</span>
            </div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Burnout Risk</p>
            <p className={`text-4xl font-extrabold leading-none mb-2 ${bs.num}`}>{d.burnout}</p>
            <p className="text-xs text-amber-600">High intensity detected in evening blocks</p>
          </article>
        </div>

        {/* ── Activity Trends chart ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" aria-labelledby="chart-heading">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 id="chart-heading" className="text-base font-bold text-gray-900">Activity Trends</h2>
              <p className="text-xs text-gray-400">Completed tasks vs. previous period</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" aria-hidden="true" />
                <span className="text-xs text-gray-500">This Week</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-gray-300 rounded-full" aria-hidden="true" />
                <span className="text-xs text-gray-500">Last Week</span>
              </div>
            </div>
          </div>

          {/* SVG chart — fixed viewBox, never stretches */}
          <div
            className="relative"
            role="img"
            aria-label={`Activity trends chart. Peak day: Thursday with ${thisWeek[peakIndex]} tasks.`}
          >
            <svg
              viewBox={`0 0 ${W + 8} ${H + 24}`}
              className="w-full"
              style={{ maxHeight: '180px' }}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1="0" y1={H * t} x2={W} y2={H * t} stroke="#f3f4f6" strokeWidth="1" />
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#areaGrad)" />

              {/* Last week dashed */}
              <polyline
                points={lastPoints}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.8"
                strokeDasharray="5,4"
                strokeLinejoin="round"
              />

              {/* This week line */}
              <polyline
                points={thisPoints}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Dots */}
              {d.current.map((v, i) => (
                <circle
                  key={i}
                  cx={px(i)} cy={py(v)} r="3.5"
                  fill={i === peakIndex ? '#4f46e5' : '#6366f1'}
                  stroke="white"
                  strokeWidth={i === peakIndex ? '2.5' : '1.5'}
                />
              ))}

              {/* Peak annotation */}
              <g>
                <rect
                  x={px(peakIndex) - 52}
                  y={py(d.current[peakIndex]) - 28}
                  width={104} height={20}
                  rx="5"
                  fill="#4f46e5"
                />
                <text
                  x={px(peakIndex)}
                  y={py(d.current[peakIndex]) - 13}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="system-ui"
                >
                  Peak · {d.peakLabel} · {d.peakValue}
                </text>
                <line
                  x1={px(peakIndex)} y1={py(d.current[peakIndex]) - 7}
                  x2={px(peakIndex)} y2={py(d.current[peakIndex]) - 1}
                  stroke="#4f46e5" strokeWidth="1.5"
                />
              </g>

              {/* X-axis labels */}
              {d.labels.map((label, i) => (
                <text
                  key={label}
                  x={px(i)}
                  y={H + 16}
                  textAnchor="middle"
                  fill={i === peakIndex ? '#4f46e5' : '#9ca3af'}
                  fontSize="10"
                  fontWeight={i === peakIndex ? '700' : '400'}
                  fontFamily="system-ui"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </section>

        {/* ── Effort Allocation — full width ────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" aria-labelledby="effort-heading">
          <div className="mb-5">
            <h2 id="effort-heading" className="text-base font-bold text-gray-900">Effort Allocation</h2>
            <p className="text-xs text-gray-400">Tasks by goal category — week over week</p>
          </div>

          <div className="space-y-4">
            {d.effort.map(item => {
              const delta = item.pct - item.prev
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 w-16">{item.label}</span>
                      <TrendArrow delta={delta} />
                    </div>
                    <span className={`text-sm font-bold ${item.text}`}>{item.pct}%</span>
                  </div>
                  <div className="relative h-7 bg-gray-100 rounded-lg overflow-hidden" role="progressbar" aria-valuenow={item.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label}: ${item.pct}%`}>
                    <div
                      className={`h-full ${item.color} rounded-lg flex items-center justify-end pr-3 transition-all duration-700`}
                      style={{ width: `${item.pct}%`, minWidth: '3rem' }}
                    >
                      <span className="text-[11px] font-bold text-white">{item.pct}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── AI Insights ──────────────────────────────────────────────── */}
        <section className="bg-gray-100/70 border border-gray-200 rounded-2xl p-5" aria-labelledby="ai-insights-heading">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 id="ai-insights-heading" className="text-base font-bold text-gray-900">AI Insights</h2>
              <p className="text-xs text-indigo-600 font-medium">Strategic adjustments for next week</p>
            </div>
          </div>

          {/* Hero insight — full width */}
          {heroInsight && (
            <article className={`rounded-2xl border-l-4 p-5 mb-4 ${heroInsight.accent}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${heroInsight.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <span className={heroInsight.iconColor}>{heroInsight.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${heroInsight.tagColor}`}>{heroInsight.tag}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{heroInsight.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{heroInsight.desc}</p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors">
                  {heroInsight.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </article>
          )}

          {/* Sub-insights — 3 in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subInsights.map(ins => (
              <article key={ins.id} className={`rounded-2xl border-l-4 p-4 flex flex-col ${ins.accent}`}>
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 ${ins.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className={ins.iconColor}>{ins.icon}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${ins.tagColor}`}>{ins.tag}</span>
                    <p className="text-sm font-bold text-gray-900 mt-1 mb-1">{ins.title}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{ins.desc}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button className="text-[11px] font-semibold text-gray-500 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors">
                    {ins.cta}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Bottom stats bar ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {d.bottomStats.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
              <span className="text-xl" aria-hidden="true">{s.icon}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Full-width CTA ───────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Apply AI-Optimized Schedule to Next Week
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <p className="text-[11px] text-gray-400">
              Last updated: <span className="font-semibold text-gray-500">{d.updated}</span>
            </p>
            <button className="text-[11px] font-semibold text-gray-400 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics