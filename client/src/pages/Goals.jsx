import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Goals = () => {
  const [objective, setObjective] = useState('')
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Research competitors and market trends', date: '2026-06-20', done: false },
    { id: 2, title: 'Define core value propositions', date: '2026-06-22', done: false },
    { id: 3, title: 'Create initial landing page wireframe', date: '2026-06-25', done: false },
  ])
  const [showSuggestion, setShowSuggestion] = useState(true)

  const aiSuggestion = 'Launch Beta to first 50 users'

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: '',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      done: false,
      editing: true,
    }
    setTasks(prev => [...prev, newTask])
  }

  const updateTask = (id, field, value) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const totalTasks = tasks.length
  const completionDays = Math.max(1, Math.ceil(
    (new Date(Math.max(...tasks.map(t => new Date(t.date)))) - new Date()) / 86400000
  ))

  const applySuggestion = () => {
    setObjective(aiSuggestion)
    setShowSuggestion(false)
  }

  const tips = [
    {
      icon: (
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
      ),
      title: 'Smart Priority',
      desc: 'Focus on high-impact tasks first to build momentum.',
      color: 'from-indigo-50 to-indigo-100/50',
    },
    {
      icon: (
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: 'Daily Focus',
      desc: 'AI will schedule these tasks based on your peak hours.',
      color: 'from-purple-50 to-purple-100/50',
    },
    {
      icon: (
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: 'Next Steps',
      desc: 'Once launched, you can start a Focus Session immediately.',
      color: 'from-emerald-50 to-emerald-100/50',
    },
  ]

  return (
    <div className="px-8 py-6 pb-0 flex flex-col min-h-full">
      <div className="flex-1">
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Objective</h1>
            <p className="text-gray-500">Define your vision and break it down into actionable steps.</p>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Potential Gain</p>
              <p className="text-lg font-extrabold text-indigo-700">+450 Points</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Objective Input */}
        <div className="mb-6 animate-slide-up stagger-1">
          <label htmlFor="objective-input" className="block text-sm font-semibold text-gray-700 mb-2">The Main Objective</label>
          <input
            id="objective-input"
            type="text"
            value={objective}
            onChange={(e) => { setObjective(e.target.value); setShowSuggestion(true) }}
            placeholder="e.g., Launch my SaaS MVP by Q3..."
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
          />
          {showSuggestion && !objective && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={applySuggestion}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-linear-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full hover:shadow-md transition-all"
              >
                <span aria-hidden="true">✨</span>
                AI Suggested: "{aiSuggestion}"
              </button>
              <span className="text-xs text-gray-400">Click to apply suggestion</span>
            </div>
          )}
        </div>

        {/* Milestones & Subtasks */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 animate-slide-up stagger-2" aria-labelledby="milestones-heading">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 id="milestones-heading" className="text-lg font-bold text-gray-900">Milestones & Subtasks</h2>
            </div>
            <button
              onClick={addTask}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-5">Breaking a goal into subtasks increases completion rate by 40%.</p>

          <ul className="space-y-3" role="list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center gap-4 px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-200 group ${
                  task.done ? 'opacity-50' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Mark "${task.title || 'Untitled task'}" as ${task.done ? 'incomplete' : 'complete'}`}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                    task.done
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {task.done && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                {task.editing ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter task title..."
                    value={task.title}
                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                    onBlur={() => updateTask(task.id, 'editing', false)}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(task.id, 'editing', false)}
                    className="flex-1 text-sm text-gray-800 bg-transparent border-none outline-none"
                    aria-label="Task title"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm font-medium cursor-pointer ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}
                    onClick={() => updateTask(task.id, 'editing', true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(task.id, 'editing', true)}
                  >
                    {task.title || 'Untitled task'}
                  </span>
                )}
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={task.date}
                      onChange={(e) => updateTask(task.id, 'date', e.target.value)}
                      className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer"
                      aria-label={`Due date for "${task.title || 'Untitled task'}"`}
                    />
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete "${task.title || 'Untitled task'}"`}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom Stats & Actions */}
        <div className="flex items-center justify-between mb-8 px-1 animate-slide-up stagger-3">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-extrabold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" aria-hidden="true"></div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Completion Estimate</p>
              <p className="text-2xl font-extrabold text-gray-900">{completionDays} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 text-gray-600 font-medium text-sm hover:text-gray-800 transition-colors">
              Save Draft
            </button>
            <button className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
              Launch Objective
            </button>
          </div>
        </div>

        {/* Tips Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tips.map((tip, i) => (
            <div key={i} className={`bg-linear-to-br ${tip.color} border border-gray-100 rounded-2xl p-5 flex items-start gap-4`}>
              {tip.icon}
              <div>
                <p className="text-sm font-bold text-gray-800">{tip.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-4 text-center">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} LifeFlow AI &middot; Built for peak performance</p>
      </div>

      {/* Floating AI Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300" aria-label="Open AI assistant">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  )
}

export default Goals