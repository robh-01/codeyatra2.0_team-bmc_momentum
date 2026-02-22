import React, { useState } from 'react'

const SubtaskTree = ({ subtasks, onAdd, onRemove, depth }) => {
  const [inputs, setInputs] = useState({})

  const depthColors = [
    'border-indigo-100 bg-white',
    'border-purple-100 bg-purple-50/30',
    'border-pink-100 bg-pink-50/30',
    'border-amber-100 bg-amber-50/30',
    'border-emerald-100 bg-emerald-50/30',
  ]
  const dotColors = [
    'bg-indigo-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-amber-400',
    'bg-emerald-400',
  ]

  const colorClass = depthColors[depth % depthColors.length]
  const dotColor = dotColors[depth % dotColors.length]

  const handleAdd = (parentId) => {
    const val = inputs[parentId] || ''
    if (!val.trim()) return
    onAdd(parentId, val)
    setInputs(prev => ({ ...prev, [parentId]: '' }))
  }

  return (
    <ul className="space-y-1.5">
      {subtasks.map((sub) => (
        <li key={sub.id}>
          <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg group ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
            <span className="flex-1 text-sm text-gray-700 truncate">{sub.title}</span>
            {/* Add child subtask toggle */}
            <button
              type="button"
              onClick={() => setInputs(prev => ({ ...prev, [`show_${sub.id}`]: !prev[`show_${sub.id}`] }))}
              title="Add sub-subtask"
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-all text-gray-400"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(sub.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded transition-all text-gray-400"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Inline add child input */}
          {inputs[`show_${sub.id}`] && (
            <div className="flex gap-1.5 mt-1 ml-4">
              <input
                type="text"
                value={inputs[sub.id] || ''}
                onChange={(e) => setInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(sub.id) } }}
                placeholder="Add sub-subtask..."
                autoFocus
                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAdd(sub.id)}
                disabled={!(inputs[sub.id] || '').trim()}
                className="px-2 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          )}
          {/* Render children recursively */}
          {sub.subtasks && sub.subtasks.length > 0 && (
            <div className="ml-4 mt-1.5 pl-3 border-l-2 border-gray-200">
              <SubtaskTree
                subtasks={sub.subtasks}
                onAdd={onAdd}
                onRemove={onRemove}
                depth={depth + 1}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default SubtaskTree
