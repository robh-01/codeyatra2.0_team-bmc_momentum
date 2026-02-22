import React, { useState } from 'react'

const Analytics = () => {
  const [activeRange, setActiveRange] = useState('weekly')

  const ranges = ['daily', 'weekly', 'monthly']

  const scoreCards = [
    {
      label: 'PRODUCTIVITY SCORE',
      value: '88',
      change: '+8%',
      positive: true,
      desc: 'Based on task complexity and completion speed',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconBg: 'bg-indigo-100',
    },
    {
      label: 'CREDIBILITY SCORE',
      value: '94%',
      change: '+2.4%',
      positive: true,
      desc: 'Measures how often you complete planned tasks',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-purple-100',
    },
    {
      label: 'BURNOUT RISK',
      value: 'Medium',
      change: '~12%',
      positive: false,
      desc: 'High intensity detected in evening blocks',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      iconBg: 'bg-amber-100',
    },
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const thisWeek = [10, 14, 18, 22, 20, 14, 8]
  const lastWeek = [8, 12, 15, 14, 16, 12, 10]
  const maxVal = 28

  const effortData = [
    { label: 'Work', pct: 45, color: 'bg-indigo-500' },
    { label: 'Health', pct: 20, color: 'bg-indigo-400' },
    { label: 'Learning', pct: 25, color: 'bg-indigo-500' },
    { label: 'Social', pct: 10, color: 'bg-indigo-300' },
  ]

  const effortLegend = [
    { label: 'Work', pct: '45%', color: 'bg-indigo-600' },
    { label: 'Health', pct: '20%', color: 'bg-orange-400' },
    { label: 'Learning', pct: '25%', color: 'bg-purple-500' },
    { label: 'Social', pct: '10%', color: 'bg-rose-400' },
  ]

  const aiInsights = [
    {
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconBg: 'bg-indigo-100',
      title: 'Peak Focus Optimization',
      desc: 'Your performance peaks between 9 AM and 11 AM. Move your "Main Goal" deep work sessions to this window for 24% higher output.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      iconBg: 'bg-red-100',
      title: 'Burnout Prevention',
      desc: 'Focus streaks exceeding 3 hours are causing a drop in "Credibility Score" later in the day. Implement mandatory 10-min breaks.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-emerald-100',
      title: 'Goal Alignment Strong',
      desc: 'You are currently hitting 92% of work-related subtasks. Consider increasing the difficulty of your "Work" goals by 10%.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      iconBg: 'bg-purple-100',
      title: 'Efficiency Insight',
      desc: 'Tasks tagged with "Learning" are taking 15% longer than estimated. AI suggests breaking these into smaller chunks.',
    },
  ]

  const bottomStats = [
    { icon: '⏱️', label: 'FOCUS TIME', value: '32.5h' },
    { icon: '✅', label: 'TASKS DONE', value: '142' },
    { icon: '🔥', label: 'AVG. STREAK', value: '8 days' },
    { icon: '🎯', label: 'GOALS MET', value: '4/5' },
  ]

  return (
    <div className="px-8 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Deep insights into your productivity, focus, and well-being.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5" role="tablist" aria-label="Time range">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                role="tab"
                aria-selected={activeRange === r}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-200 ${
                  activeRange === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600" aria-label="Filter results">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600" aria-label="Export report">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {scoreCards.map((card, i) => (
          <article key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1">
                <svg className={`w-3.5 h-3.5 ${card.positive ? 'text-emerald-500' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.positive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
                <span className={`text-xs font-semibold ${card.positive ? 'text-emerald-500' : 'text-red-400'}`}>{card.change}</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-2">{card.value}</p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <span aria-hidden="true">ⓘ</span> {card.desc}
            </p>
          </article>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Activity Trends - takes 2 cols */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-gray-900">Activity Trends</h2>
              <p className="text-xs text-gray-400">Completed tasks vs. Previous period</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" aria-hidden="true"></span>
                <span className="text-xs text-gray-500">This Week</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-gray-300 rounded-full" aria-hidden="true"></span>
                <span className="text-xs text-gray-500">Last Week</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-4 relative h-48" role="img" aria-label="Activity trends chart showing completed tasks this week versus last week. Thursday had the most tasks completed this week with 22.">
            {/* Y axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] text-gray-400 w-8" aria-hidden="true">
              <span>28</span>
              <span>21</span>
              <span>14</span>
              <span>7</span>
              <span>0</span>
            </div>
            {/* Grid and chart area */}
            <div className="ml-10 h-full relative">
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: `${(i / 4) * 100}%` }} aria-hidden="true"></div>
              ))}
              {/* SVG chart */}
              <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
                {/* Area fill for this week */}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${180 - (thisWeek[0] / maxVal) * 170} ${thisWeek.map((v, i) => `L${(i / 6) * 600},${180 - (v / maxVal) * 170}`).join(' ')} L600,180 L0,180 Z`}
                  fill="url(#areaGrad)"
                />
                {/* This week line */}
                <polyline
                  points={thisWeek.map((v, i) => `${(i / 6) * 600},${180 - (v / maxVal) * 170}`).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Last week dashed line */}
                <polyline
                  points={lastWeek.map((v, i) => `${(i / 6) * 600},${180 - (v / maxVal) * 170}`).join(' ')}
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  strokeLinejoin="round"
                />
                {/* Dots for this week */}
                {thisWeek.map((v, i) => (
                  <circle key={i} cx={(i / 6) * 600} cy={180 - (v / maxVal) * 170} r="3.5" fill="#6366f1" />
                ))}
              </svg>
              {/* X axis labels */}
              <div className="flex justify-between mt-2 text-[11px] text-gray-400" aria-hidden="true">
                {weekDays.map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Effort Allocation */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-base font-bold text-gray-900 mb-0.5">Effort Allocation</h2>
          <p className="text-xs text-gray-400 mb-5">Tasks by goal category</p>

          <div className="space-y-4 mb-6">
            {effortData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-14 text-right shrink-0">{item.label}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-md overflow-hidden" role="progressbar" aria-valuenow={item.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label}: ${item.pct}%`}>
                    <div
                      className={`h-full ${item.color} rounded-md transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {effortLegend.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color}`} aria-hidden="true"></span>
                <span className="text-xs text-gray-600">{item.label}</span>
                <span className="text-xs font-semibold text-gray-800 ml-auto">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Intelligence Report */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-6" aria-labelledby="ai-report-heading">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 id="ai-report-heading" className="text-base font-bold text-gray-900">AI Intelligence Report</h2>
            <p className="text-xs text-indigo-600 font-medium">Strategic adjustments for next week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {aiInsights.map((insight, i) => (
            <article key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 ${insight.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                  {insight.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{insight.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-right">
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors">
            Apply AI-Optimized Schedule
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {bottomStats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-lg" aria-hidden="true">{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Analytics