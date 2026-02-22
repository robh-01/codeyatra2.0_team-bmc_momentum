import React from 'react'
import SubtaskTree from './SubtaskTree'

const ManualTaskForm = ({
  manualTask,
  setManualTask,
  subtaskInput,
  setSubtaskInput,
  onAddSubtask,
  onAddNestedSubtask,
  onRemoveNestedSubtask,
  onSubmit,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Add Task Manually</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="manual-title" className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title <span className="text-red-400">*</span></label>
          <input
            id="manual-title"
            type="text"
            autoFocus
            required
            value={manualTask.title}
            onChange={(e) => setManualTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Research competitor products"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="manual-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            id="manual-desc"
            rows={2}
            value={manualTask.description}
            onChange={(e) => setManualTask(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add any details or notes about this task..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none"
          />
        </div>

        {/* Subtasks */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtasks <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddSubtask() } }}
              placeholder="Type a subtask and press Enter..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
            <button
              type="button"
              onClick={onAddSubtask}
              disabled={!subtaskInput.trim()}
              className="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          {manualTask.subtasks.length > 0 && (
            <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-2">
              <SubtaskTree
                subtasks={manualTask.subtasks}
                onAdd={onAddNestedSubtask}
                onRemove={onRemoveNestedSubtask}
                depth={0}
              />
            </div>
          )}
        </div>

        {/* Date & Priority Row */}
        <div className="flex gap-4 mb-6">
          {/* Due Date */}
          <div className="flex-1">
            <label htmlFor="manual-date" className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
            <input
              id="manual-date"
              type="date"
              value={manualTask.date}
              onChange={(e) => setManualTask(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
          </div>

          {/* Priority */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setManualTask(prev => ({ ...prev, priority: p }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border-2 transition-all duration-200 ${
                    manualTask.priority === p
                      ? p === 'high'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : p === 'medium'
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!manualTask.title.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManualTaskForm
