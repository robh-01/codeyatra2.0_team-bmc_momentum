import React from 'react'

const GoalStats = ({ totalTasks, completedTasks, activeTasks, pendingTasks, completionDays }) => {
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-slide-up stagger-3">
      {/* Overall progress */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Overall Progress</h3>
          <p className="text-xs text-gray-400 mt-0.5">{completedTasks} of {totalTasks} tasks completed</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-indigo-600">{overallPct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-xl font-extrabold text-gray-900">{totalTasks}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Done</p>
          <p className="text-xl font-extrabold text-emerald-600">{completedTasks}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Active</p>
          <p className="text-xl font-extrabold text-blue-600">{activeTasks}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-xl font-extrabold text-amber-600">{pendingTasks}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Timeline</p>
          <p className="text-xl font-extrabold text-indigo-600">{completionDays}d</p>
        </div>
      </div>
    </div>
  )
}

export default GoalStats
