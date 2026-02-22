import React from 'react'
import { statusConfig, priorityColors, countAllSubtasks } from './goalConstants'

// Recursive subtask list for the detail modal
const DetailSubtaskList = ({ subtasks, depth = 0, onCycleSubtaskStatus, onUpdateSubtaskDate }) => {
  if (!subtasks || subtasks.length === 0) return null
  const depthColors = ['border-indigo-200', 'border-purple-200', 'border-pink-200', 'border-amber-200', 'border-emerald-200']

  return (
    <div className={`space-y-2 ${depth > 0 ? `ml-5 pl-4 border-l-2 ${depthColors[depth % depthColors.length]}` : ''}`}>
      {subtasks.map(sub => {
        const sCfg = statusConfig[sub.status || 'pending']
        return (
          <div key={sub.id}>
            <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
              <button
                onClick={(e) => { e.stopPropagation(); onCycleSubtaskStatus(sub.id) }}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  sub.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : sub.status === 'active'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-amber-400'
                }`}
              >
                {sub.status === 'completed' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
                {sub.status === 'active' && (
                  <span className="text-[8px]">▶</span>
                )}
              </button>
              <span className={`flex-1 text-sm ${
                sub.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'
              }`}>{sub.title}</span>
              {/* Subtask date picker */}
              <input
                type="date"
                value={sub.date || ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onUpdateSubtaskDate(sub.id, e.target.value)}
                className="text-[11px] text-gray-400 bg-transparent border-none outline-none cursor-pointer w-24 shrink-0"
              />
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sCfg.color}`}>{sCfg.label}</span>
            </div>
            <DetailSubtaskList
              subtasks={sub.subtasks}
              depth={depth + 1}
              onCycleSubtaskStatus={onCycleSubtaskStatus}
              onUpdateSubtaskDate={onUpdateSubtaskDate}
            />
          </div>
        )
      })}
    </div>
  )
}

const TaskDetailModal = ({ task, onClose, onSetStatus, onCycleSubtaskStatus, onUpdateSubtaskDate, onDrillInto, onDelete }) => {
  if (!task) return null

  const status = task.status || 'pending'
  const cfg = statusConfig[status]
  const subtaskStats = countAllSubtasks(task.subtasks)
  const progressPct = (() => {
    if (subtaskStats.total > 0) return Math.round((subtaskStats.completed / subtaskStats.total) * 100)
    const statusPct = { pending: 0, active: 40, completed: 100 }
    return statusPct[status] || 0
  })()
  const progressLabel = subtaskStats.total > 0
    ? `${subtaskStats.completed}/${subtaskStats.total} done`
    : status === 'completed' ? 'Complete' : status === 'active' ? 'In progress' : 'Not started'
  const daysLeft = Math.max(0, Math.ceil((new Date(task.date) - new Date()) / 86400000))

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient bar */}
        <div className={`h-2 bg-gradient-to-r ${cfg.gradient}`} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Close + Status row */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => {
                const order = ['pending', 'active', 'completed']
                const idx = order.indexOf(status)
                const next = order[(idx + 1) % order.length]
                onSetStatus(task.id, next)
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all hover:shadow-md ${cfg.color}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
              {cfg.label}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-extrabold mb-2 leading-tight ${
            status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
          }`}>
            {task.title || 'Untitled task'}
          </h2>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{task.description}</p>
          )}

          {/* Info cards row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Priority */}
            <div className="bg-gray-50 rounded-2xl p-3.5 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${priorityColors[task.priority || 'medium']}`}>
                {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority || 'medium'}
              </span>
            </div>
            {/* Due date */}
            <div className="bg-gray-50 rounded-2xl p-3.5 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
              <p className={`text-sm font-bold ${
                daysLeft <= 2 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-gray-800'
              }`}>
                {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className={`text-[10px] font-medium mt-0.5 ${
                daysLeft <= 2 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-gray-400'
              }`}>
                {daysLeft === 0 ? 'Due today!' : `${daysLeft} days left`}
              </p>
            </div>
            {/* Progress */}
            <div className="bg-gray-50 rounded-2xl p-3.5 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Progress</p>
              <p className="text-xl font-extrabold text-indigo-600">{progressPct}%</p>
              <p className="text-[10px] text-gray-400">{progressLabel}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-700 ease-out`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Status switcher */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Change Status</p>
            <div className="flex gap-2">
              {['pending', 'active', 'completed'].map((s) => {
                const sc = statusConfig[s]
                return (
                  <button
                    key={s}
                    onClick={() => onSetStatus(task.id, s)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                      status === s
                        ? `${sc.color} border-current shadow-sm ring-2 ${sc.ring}`
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    <span className="mr-1.5">{sc.icon}</span>
                    {sc.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subtasks list */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Subtasks ({subtaskStats.completed}/{subtaskStats.total})
              </p>
              <DetailSubtaskList
                subtasks={task.subtasks}
                onCycleSubtaskStatus={onCycleSubtaskStatus}
                onUpdateSubtaskDate={onUpdateSubtaskDate}
              />
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={() => {
              onDrillInto(task)
              onClose()
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            View Subtasks
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDelete(task.id)
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
