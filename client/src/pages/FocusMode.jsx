import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { dailyPlanApi } from '../services/api'

const FocusMode = () => {
  const navigate = useNavigate()
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [tasks, setTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [allDone, setAllDone] = useState(false)
  const intervalRef = useRef(null)

  // Fetch today's tasks on mount
  useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]
        
        const plan = await dailyPlanApi.getDailyPlan(dateStr)
        if (plan && plan.tasks && plan.tasks.length > 0) {
          setTasks(plan.tasks)
          const mins = plan.tasks[0]?.estimatedMins || 25
          setTotalSeconds(mins * 60)
        }
      } catch (err) {
        console.error('Error fetching today tasks:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTodayTasks()
  }, [])

  const currentTask = tasks[currentTaskIndex] || null
  const currentMins = currentTask?.estimatedMins || 25
  const initialSeconds = currentMins * 60

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 0) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isPaused])

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const progress = initialSeconds > 0 ? 1 - totalSeconds / initialSeconds : 0
  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference * (1 - progress)

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const completeTask = useCallback(() => {
    if (currentTaskIndex < tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1
      setCurrentTaskIndex(nextIndex)
      const nextMins = tasks[nextIndex]?.estimatedMins || 25
      setTotalSeconds(nextMins * 60)
      setIsRunning(true)
      setIsPaused(false)
    } else {
      setIsRunning(false)
      setTotalSeconds(0)
      setAllDone(true)
    }
  }, [currentTaskIndex, tasks])

  const selectTask = useCallback((index) => {
    setCurrentTaskIndex(index)
    const mins = tasks[index]?.estimatedMins || 25
    setTotalSeconds(mins * 60)
    setIsRunning(false)
    setIsPaused(false)
  }, [tasks])

  const startTask = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePause])

  const [showTaskList, setShowTaskList] = useState(false)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      {/* Task Sidebar - Left side, full height on desktop; overlay on mobile */}
      <aside className={`${
        showTaskList ? 'fixed inset-0 z-50 bg-white' : 'hidden'
      } md:static md:flex md:w-72 lg:w-80 flex-shrink-0 bg-white border-r border-gray-100 flex-col`}>
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
            <p className="text-sm text-gray-400 mt-1">{tasks.length} tasks</p>
          </div>
          <button
            onClick={() => setShowTaskList(false)}
            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close task list"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks planned</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <button
                  key={index}
                  onClick={() => selectTask(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    index === currentTaskIndex 
                      ? 'bg-indigo-50 border border-indigo-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      index === currentTaskIndex ? 'bg-indigo-500 text-white' : 'bg-gray-200'
                    }`}>
                      {index < currentTaskIndex ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        index === currentTaskIndex ? 'text-indigo-900' : 'text-gray-700'
                      }`}>
                        {task.title}
                      </p>
                      {task.estimatedMins && (
                        <p className="text-xs text-gray-400 mt-1">{task.estimatedMins} min</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 min-h-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4" role="banner">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Exit focus mode and return to dashboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exit Focus
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile task list toggle */}
          <button
            onClick={() => setShowTaskList(true)}
            className="md:hidden p-2 hover:bg-white/60 rounded-lg transition-colors text-gray-500 hover:text-gray-700 relative"
            aria-label="View task list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {tasks.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {tasks.length}
              </span>
            )}
          </button>
          <button className="p-2 hover:bg-white/60 rounded-lg transition-colors text-gray-500 hover:text-gray-700" aria-label="Toggle ambient sound">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-indigo-50 border border-indigo-100 rounded-full" role="status">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-indigo-600">Flow Mode Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Area - no scroll */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 overflow-hidden">
        {/* Timer Area */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-8">
          {/* Task Info */}
          <div className="text-center mb-4 sm:mb-6 animate-fade-in">
            {loading ? (
              <p className="text-sm text-gray-400">Loading tasks...</p>
            ) : allDone ? (
              <>
                <p className="text-sm text-emerald-500 font-medium mb-2">All tasks completed!</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Great work today
                </h1>
                <p className="text-sm text-gray-500 mt-2">You've finished all {tasks.length} scheduled tasks.</p>
              </>
            ) : currentTask ? (
              <>
                {currentTask.startTime && (
                  <p className="text-xs font-medium text-indigo-500 mb-2">
                    {currentTask.startTime}{currentTask.endTime ? ` - ${currentTask.endTime}` : ''}
                    {currentTask.estimatedMins && (
                      <span className="text-gray-400 ml-2">({currentTask.estimatedMins} min)</span>
                    )}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {currentTask.title}
                </h1>
                {currentTask.description && (
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{currentTask.description}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-2">No tasks planned for today</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Start a focus session
                </h1>
                <p className="text-sm text-gray-500 mt-2">Select a task to begin</p>
              </>
            )}
          </div>

        {/* Timer Circle */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-4 sm:mb-6" role="timer" aria-label={`${String(minutes).padStart(2, '0')} minutes and ${String(seconds).padStart(2, '0')} seconds remaining`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300" aria-hidden="true">
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
              opacity="0.3"
            />
            {/* Progress circle */}
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight tabular-nums" aria-live="off">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm" aria-hidden="true">✨</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {isPaused ? 'Paused' : 'Focusing'}
              </span>
            </div>
          </div>
        </div>

        {/* Motivation text */}
        <p className="text-xs sm:text-sm text-gray-400 italic mb-3 sm:mb-4">
          "Your focus determines your reality."
        </p>

        {/* Points indicator */}
        <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-semibold text-gray-500">{currentMins} Streak Points if completed</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {!isRunning ? (
            <button
              onClick={startTask}
              disabled={!currentTask}
              aria-label="Start focus session"
              className="flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Focus
            </button>
          ) : (
            <button
              onClick={togglePause}
              aria-label={isPaused ? 'Resume focus session' : 'Pause focus session'}
              className="flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:translate-y-0 transition-all duration-200"
            >
              {isPaused ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Resume Flow
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
                  </svg>
                  Pause Flow
                </>
              )}
            </button>
          )}
          <button
            onClick={completeTask}
            disabled={allDone || !currentTask || !isRunning}
            aria-label={currentTaskIndex < tasks.length - 1 ? 'Complete task and move to next' : 'Complete final task'}
            className="flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {currentTaskIndex < tasks.length - 1 ? 'Next Task' : 'Complete Task'}
          </button>
        </div>

        </div>

        </main>
      </div>
    </div>
  )
}

export default FocusMode