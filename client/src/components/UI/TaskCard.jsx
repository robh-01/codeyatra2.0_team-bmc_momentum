import React from 'react'
import { statusConfig, priorityColors, countAllSubtasks } from './goalConstants'

// Compute progress considering both subtasks and task's own status
const getTaskProgress = (task) => {
  const stats = countAllSubtasks(task.subtasks)
  if (stats.total > 0) {
    return { pct: Math.round((stats.completed / stats.total) * 100), label: `${stats.completed}/${stats.total} subtasks`, hasSubtasks: true, stats }
  }
  const statusPct = { pending: 0, active: 40, completed: 100 }
  const statusLabel = { pending: 'Not started', active: 'In progress', completed: 'Complete' }
  const s = task.status || 'pending'
  return { pct: statusPct[s] || 0, label: statusLabel[s] || 'Not started', hasSubtasks: false, stats }
}

const TaskCard = ({ task, onSelect, onCycleStatus, onDrillInto, onDelete }) => {
  const status = task.status || 'pending'
  const cfg = statusConfig[status]
  const progress = getTaskProgress(task)
  const daysLeft = Math.max(0, Math.ceil((new Date(task.date) - new Date()) / 86400000))

  return (
    <div
      onClick={() => onSelect(task)}
      className={`relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border ${cfg.border}`}
    >
      {/* Top gradient accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5">
        {/* Status + Priority row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={(e) => { e.stopPropagation(); onCycleStatus(task.id) }}
            title={`Status: ${cfg.label} (click to change)`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:shadow-sm ${cfg.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${cfg.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
            {cfg.label}
          </button>
          <div className="flex items-center gap-1.5">
            {task.priority && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${priorityColors[task.priority]}`}>
                {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className={`text-base font-bold mb-1.5 leading-snug ${
          status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
        }`}>
          {task.title || 'Untitled task'}
        </h4>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {progress.hasSubtasks ? (
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              <span className="text-xs font-semibold text-gray-600">
                {progress.label}
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-600">{progress.pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-700 ease-out`}
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>

        {/* Footer: date + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${
              daysLeft <= 2 ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-gray-500'
            }`}>
              {daysLeft === 0 ? 'Due today' : daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDrillInto(task) }}
              title="View subtasks"
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all text-gray-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
              aria-label={`Delete "${task.title || 'Untitled task'}"`}
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-gray-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
