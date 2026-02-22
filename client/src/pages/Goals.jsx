import React, { useReducer, useRef } from 'react'
import { Link } from 'react-router-dom'
import AIChat from '../components/UI/AIChat'
import TaskCard from '../components/UI/TaskCard'
import TaskDetailModal from '../components/UI/TaskDetailModal'
import ManualTaskForm from '../components/UI/ManualTaskForm'
import GoalStats from '../components/UI/GoalStats'
import { collectAllDates } from '../components/UI/goalConstants'
import { useGoals } from '../context/GoalsContext'
import { goalApi } from '../services/api'

// ── Default manual task factory ──────────────────────────────────
const defaultManualTask = () => ({
  title: '',
  description: '',
  subtasks: [],
  date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  priority: 'medium'
})

// ── Initial state ────────────────────────────────────────────────
const initialState = {
  objective: '',
  tasks: [],
  showChat: false,
  chatMessages: [],
  isLoading: false,
  error: null,
  streamingContent: '',
  thinkingMode: true,
  showManualForm: false,
  manualTask: defaultManualTask(),
  subtaskInput: '',
  taskPath: [],
  selectedTask: null,
}

// ── Reducer ──────────────────────────────────────────────────────
function goalsReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'TOGGLE_FIELD':
      return { ...state, [action.field]: !state[action.field] }
    case 'START_LOADING':
      return { ...state, isLoading: true, error: null, streamingContent: '' }
    case 'STOP_LOADING':
      return { ...state, isLoading: false }
    case 'SET_CHAT_RESULT':
      return { ...state, chatMessages: action.messages, streamingContent: '', isLoading: false }
    case 'SET_CHAT_ERROR':
      return { ...state, error: action.error, chatMessages: action.messages, streamingContent: '', isLoading: false }
    case 'OPEN_CHAT':
      return { ...state, showChat: true, isLoading: true, error: null, chatMessages: [], streamingContent: '' }
    case 'APPLY_AI_TASKS':
      return { ...state, tasks: action.tasks, taskPath: [], showChat: false, isLoading: false }
    case 'OPEN_MANUAL_FORM':
      return { ...state, manualTask: defaultManualTask(), subtaskInput: '', showManualForm: true }
    case 'UPDATE_MANUAL_TASK':
      return { ...state, manualTask: typeof action.updater === 'function' ? action.updater(state.manualTask) : action.updater }
    case 'SUBMIT_MANUAL_TASK':
      return { ...state, showManualForm: false }
    case 'SET_TASKS':
      return { ...state, tasks: typeof action.updater === 'function' ? action.updater(state.tasks) : action.updater }
    case 'NAVIGATE_TO':
      return { ...state, taskPath: state.taskPath.slice(0, action.index) }
    case 'DRILL_INTO':
      return { ...state, taskPath: [...state.taskPath, { id: action.task.id, title: action.task.title }], selectedTask: null }
    case 'SELECT_TASK':
      return { ...state, selectedTask: action.task }
    case 'UPDATE_SELECTED_TASK':
      return { ...state, selectedTask: typeof action.updater === 'function' ? action.updater(state.selectedTask) : action.updater }
    default:
      return state
  }
}

const Goals = () => {
  const { addGoal, updateGoalTasks } = useGoals()
  const [state, dispatch] = useReducer(goalsReducer, initialState)
  const {
    objective, tasks, showChat, chatMessages, isLoading, error,
    streamingContent, thinkingMode, showManualForm, manualTask,
    subtaskInput, taskPath, selectedTask,
  } = state

  // ── AI Discussion ──────────────────────────────────────────────

  const startGoalDiscussion = async () => {
    if (!objective.trim()) return
    dispatch({ type: 'OPEN_CHAT' })

    const userMessage = {
      role: 'user',
      content: `I want to achieve this goal: "${objective}". Can you help me break it down into manageable subgoals?`
    }
    dispatch({ type: 'SET_FIELD', field: 'chatMessages', value: [userMessage] })

    try {
      const response = await goalApi.discuss(
        { goal: objective, conversationHistory: [], enableThinking: thinkingMode },
        (chunk, fullContent) => dispatch({ type: 'SET_FIELD', field: 'streamingContent', value: fullContent })
      )
      dispatch({ type: 'SET_CHAT_RESULT', messages: [userMessage, { role: 'assistant', content: response.message }] })
    } catch (err) {
      dispatch({
        type: 'SET_CHAT_ERROR',
        error: err.message,
        messages: [userMessage, { role: 'error', content: `Sorry, I encountered an error: ${err.message}. Please make sure the server is running.` }]
      })
    }
  }

  const handleSendMessage = async (message) => {
    const newMessages = [...chatMessages, { role: 'user', content: message }]
    dispatch({ type: 'SET_FIELD', field: 'chatMessages', value: newMessages })
    dispatch({ type: 'START_LOADING' })

    try {
      const response = await goalApi.discuss(
        { goal: objective, conversationHistory: newMessages, userMessage: message, enableThinking: thinkingMode },
        (chunk, fullContent) => dispatch({ type: 'SET_FIELD', field: 'streamingContent', value: fullContent })
      )
      dispatch({ type: 'SET_CHAT_RESULT', messages: [...newMessages, { role: 'assistant', content: response.message }] })
    } catch (err) {
      dispatch({
        type: 'SET_CHAT_ERROR',
        error: err.message,
        messages: [...newMessages, { role: 'error', content: `Sorry, I encountered an error: ${err.message}` }]
      })
    }
  }

  const applyAISuggestions = async () => {
    if (chatMessages.length < 2) return
    dispatch({ type: 'START_LOADING' })

    try {
      const response = await goalApi.extractSubgoals({
        goal: objective,
        conversationHistory: chatMessages
      })
      if (response.subgoals && response.subgoals.length > 0) {
        const newTasks = response.subgoals.map((subgoal, index) => ({
          id: Date.now() + index,
          title: subgoal.title,
          date: new Date(Date.now() + (subgoal.estimatedDays || 7) * 86400000).toISOString().split('T')[0],
          priority: subgoal.priority || 'medium',
          status: 'pending',
          subtasks: []
        }))
        dispatch({ type: 'APPLY_AI_TASKS', tasks: newTasks })
      }
    } catch (err) {
      dispatch({
        type: 'SET_CHAT_ERROR',
        error: err.message,
        messages: [...chatMessages, { role: 'assistant', content: `I couldn't extract the subgoals automatically. You can add them manually from our discussion.` }]
      })
    } finally {
      dispatch({ type: 'STOP_LOADING' })
    }
  }

  // ── Manual Form Helpers ────────────────────────────────────────

  const openManualForm = () => dispatch({ type: 'OPEN_MANUAL_FORM' })

  const addSubtaskToForm = () => {
    if (!subtaskInput.trim()) return
    dispatch({
      type: 'UPDATE_MANUAL_TASK',
      updater: prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { id: Date.now(), title: subtaskInput.trim(), status: 'pending', date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], subtasks: [] }]
      })
    })
    dispatch({ type: 'SET_FIELD', field: 'subtaskInput', value: '' })
  }

  const addNestedFormSubtask = (subtasks, parentId, newSub) => {
    return subtasks.map(s => {
      if (s.id === parentId) return { ...s, subtasks: [...(s.subtasks || []), newSub] }
      if (s.subtasks && s.subtasks.length > 0) return { ...s, subtasks: addNestedFormSubtask(s.subtasks, parentId, newSub) }
      return s
    })
  }

  const removeNestedFormSubtask = (subtasks, targetId) => {
    return subtasks
      .filter(s => s.id !== targetId)
      .map(s => ({ ...s, subtasks: s.subtasks ? removeNestedFormSubtask(s.subtasks, targetId) : [] }))
  }

  const handleAddNestedSubtask = (parentId, title) => {
    if (!title.trim()) return
    const newSub = { id: Date.now() + Math.random(), title: title.trim(), status: 'pending', date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], subtasks: [] }
    dispatch({ type: 'UPDATE_MANUAL_TASK', updater: prev => ({ ...prev, subtasks: addNestedFormSubtask(prev.subtasks, parentId, newSub) }) })
  }

  const handleRemoveNestedSubtask = (targetId) => {
    dispatch({ type: 'UPDATE_MANUAL_TASK', updater: prev => ({ ...prev, subtasks: removeNestedFormSubtask(prev.subtasks, targetId) }) })
  }

  const submitManualTask = (e) => {
    e.preventDefault()
    if (!manualTask.title.trim()) return
    const newTask = {
      id: Date.now(),
      title: manualTask.title.trim(),
      description: manualTask.description.trim(),
      date: manualTask.date,
      priority: manualTask.priority,
      status: 'pending',
      subtasks: manualTask.subtasks,
    }
    if (taskPath.length > 0) {
      dispatch({ type: 'SET_TASKS', updater: prev => addNestedSubtask(prev, taskPath, newTask) })
    } else {
      dispatch({ type: 'SET_TASKS', updater: prev => [...prev, newTask] })
    }
    dispatch({ type: 'SUBMIT_MANUAL_TASK' })
  }

  // ── Task Tree Helpers ──────────────────────────────────────────

  const addNestedSubtask = (taskList, path, newTask) => {
    if (path.length === 0) return [...taskList, newTask]
    return taskList.map(t => {
      if (t.id === path[0].id) return { ...t, subtasks: addNestedSubtask(t.subtasks || [], path.slice(1), newTask) }
      return t
    })
  }

  const getVisibleTasks = () => {
    let current = tasks
    for (const crumb of taskPath) {
      const found = current.find(t => t.id === crumb.id)
      if (!found) return []
      current = found.subtasks || []
    }
    return current
  }

  const drillIntoTask = (task) => {
    dispatch({ type: 'DRILL_INTO', task })
  }

  const navigateTo = (index) => dispatch({ type: 'NAVIGATE_TO', index })

  const updateNestedTasks = (taskList, path, id, updater) => {
    if (path.length === 0) return taskList.map(t => t.id === id ? updater(t) : t)
    return taskList.map(t => {
      if (t.id === path[0].id) return { ...t, subtasks: updateNestedTasks(t.subtasks || [], path.slice(1), id, updater) }
      return t
    })
  }

  const filterNestedTasks = (taskList, path, id) => {
    if (path.length === 0) return taskList.filter(t => t.id !== id)
    return taskList.map(t => {
      if (t.id === path[0].id) return { ...t, subtasks: filterNestedTasks(t.subtasks || [], path.slice(1), id) }
      return t
    })
  }

  const autoCompleteParents = (taskList) => {
    return taskList.map(t => {
      if (!t.subtasks || t.subtasks.length === 0) return t
      const updatedSubs = autoCompleteParents(t.subtasks)
      const allDone = updatedSubs.length > 0 && updatedSubs.every(s => s.status === 'completed')
      return { ...t, subtasks: updatedSubs, status: allDone ? 'completed' : t.status }
    })
  }

  const deleteTask = (id) => {
    dispatch({ type: 'SET_TASKS', updater: prev => filterNestedTasks(prev, taskPath, id) })
    dispatch({ type: 'SELECT_TASK', task: null })
  }

  const cycleStatus = (id) => {
    const order = ['pending', 'active', 'completed']
    dispatch({
      type: 'SET_TASKS',
      updater: prev => autoCompleteParents(updateNestedTasks(prev, taskPath, id, t => {
        const currentIdx = order.indexOf(t.status || 'pending')
        return { ...t, status: order[(currentIdx + 1) % order.length] }
      }))
    })
  }

  const setTaskStatus = (id, status) => {
    dispatch({ type: 'SET_TASKS', updater: prev => autoCompleteParents(updateNestedTasks(prev, taskPath, id, t => ({ ...t, status }))) })
    dispatch({ type: 'UPDATE_SELECTED_TASK', updater: prev => prev ? { ...prev, status } : null })
  }

  // ── Deep update helpers for detail modal subtask interactions ──

  const updateDeepById = (list, targetId, updater) => {
    return list.map(t => {
      if (t.id === targetId) return updater(t)
      if (t.subtasks) return { ...t, subtasks: updateDeepById(t.subtasks, targetId, updater) }
      return t
    })
  }

  const cycleSubtaskStatus = (subId) => {
    const order = ['pending', 'active', 'completed']
    const updater = (t) => {
      const idx = order.indexOf(t.status || 'pending')
      return { ...t, status: order[(idx + 1) % order.length] }
    }
    dispatch({ type: 'SET_TASKS', updater: prev => autoCompleteParents(updateDeepById(prev, subId, updater)) })
    dispatch({
      type: 'UPDATE_SELECTED_TASK',
      updater: prev => {
        if (!prev) return prev
        const updatedSubs = updateDeepById(prev.subtasks || [], subId, updater)
        const allDone = updatedSubs.length > 0 && updatedSubs.every(s => s.status === 'completed')
        return { ...prev, subtasks: updatedSubs, status: allDone ? 'completed' : prev.status }
      }
    })
  }

  const updateSubtaskDate = (subId, newDate) => {
    const updater = (t) => ({ ...t, date: newDate })
    dispatch({ type: 'SET_TASKS', updater: prev => updateDeepById(prev, subId, updater) })
    dispatch({
      type: 'UPDATE_SELECTED_TASK',
      updater: prev => {
        if (!prev) return prev
        return { ...prev, subtasks: updateDeepById(prev.subtasks || [], subId, updater) }
      }
    })
  }

  // ── Computed Stats ─────────────────────────────────────────────

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const activeTasks = tasks.filter(t => t.status === 'active').length
  const pendingTasks = tasks.filter(t => t.status === 'pending' || !t.status).length
  const completionDays = (() => {
    const allDates = collectAllDates(tasks)
    if (allDates.length === 0) return 0
    const latest = new Date(Math.max(...allDates))
    const earliest = new Date(Math.min(...allDates))
    const fromNow = Math.ceil((latest - new Date()) / 86400000)
    const span = Math.ceil((latest - earliest) / 86400000)
    return Math.max(1, Math.max(fromNow, span))
  })()

  const quickActions = [
    "I have about 3 months for this",
    "I can dedicate 2 hours daily",
    "What should I prioritize first?",
    "These look good, finalize them"
  ]

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 px-8 py-6 overflow-y-auto transition-all duration-300 ${showChat ? 'pr-4' : ''}`}>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Goal</h1>
            <p className="text-gray-500">Define your vision and let AI help break it down into actionable steps.</p>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Powered</p>
              <p className="text-lg font-extrabold text-indigo-700">Goal Coach</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Objective Input */}
        <div className="mb-6 animate-slide-up stagger-1">
          <label htmlFor="objective-input" className="block text-sm font-semibold text-gray-700 mb-2">What's your main goal?</label>
          <div className="flex gap-3">
            <input
              id="objective-input"
              type="text"
              value={objective}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'objective', value: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && startGoalDiscussion()}
              placeholder="e.g., Launch my SaaS MVP by Q3, Learn Spanish to conversational level..."
              className="flex-1 px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FIELD', field: 'thinkingMode' })}
              title={thinkingMode ? "Thinking mode ON - AI will reason deeply" : "Thinking mode OFF - Faster responses"}
              className={`px-4 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border-2 ${
                thinkingMode
                  ? 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden sm:inline">{thinkingMode ? 'Deep' : 'Fast'}</span>
            </button>
            <button
              onClick={startGoalDiscussion}
              disabled={!objective.trim() || isLoading}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Discuss with AI
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            AI will help you break down this goal into achievable subgoals through conversation.
            {thinkingMode && <span className="text-purple-500 ml-1">(Deep thinking enabled)</span>}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Milestones & Subtasks */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 animate-slide-up stagger-2" aria-labelledby="milestones-heading">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 id="milestones-heading" className="text-lg font-bold text-gray-900">Goals or Tsks</h2>
            </div>
            <button
              onClick={openManualForm}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Manually
            </button>
          </div>

          {/* Breadcrumb Navigation */}
          {taskPath.length > 0 && (
            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              <button onClick={() => navigateTo(0)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                Main Tasks
              </button>
              {taskPath.map((crumb, i) => (
                <React.Fragment key={crumb.id}>
                  <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <button
                    onClick={() => navigateTo(i + 1)}
                    className={`text-xs font-semibold transition-colors truncate max-w-[140px] ${
                      i === taskPath.length - 1 ? 'text-gray-800 cursor-default' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                    title={crumb.title}
                  >
                    {crumb.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-400 mb-5">
            {taskPath.length > 0
              ? `Subtasks of "${taskPath[taskPath.length - 1].title}"`
              : tasks.length === 0
                ? "Enter a goal above and discuss it with AI to generate subgoals, or add them manually."
                : "These subgoals were generated from your AI conversation. Feel free to edit them."}
          </p>

          {getVisibleTasks().length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">{taskPath.length > 0 ? 'No subtasks yet' : 'No subgoals yet'}</p>
              <p className="text-sm text-gray-400">{taskPath.length > 0 ? 'Click "Add Manually" to add subtasks here' : 'Start a conversation with AI to break down your goal'}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {getVisibleTasks().map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={(task) => dispatch({ type: 'SELECT_TASK', task })}
                  onCycleStatus={cycleStatus}
                  onDrillInto={drillIntoTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Stats */}
        {tasks.length > 0 && (
          <GoalStats
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            activeTasks={activeTasks}
            pendingTasks={pendingTasks}
            completionDays={completionDays}
          />
        )}
      </div>

      {/* AI Chat Sidebar */}
      {showChat && (
        <div className="w-96 border-l border-gray-100 flex flex-col bg-gray-50 shrink-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 className="font-semibold text-gray-900">Goal Discussion</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_FIELD', field: 'thinkingMode' })}
                title={thinkingMode ? "Thinking mode ON" : "Thinking mode OFF"}
                className={`p-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                  thinkingMode
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-[10px] font-medium">{thinkingMode ? 'Deep' : 'Fast'}</span>
              </button>
              <button
                onClick={applyAISuggestions}
                disabled={chatMessages.length < 2 || isLoading}
                className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Suggestions
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showChat', value: false })}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Discuss your goal with AI..."
              quickActions={quickActions}
              title="Goal Coach"
              subtitle="Helping you plan"
              streamingContent={streamingContent}
            />
          </div>
        </div>
      )}

      {/* Manual Task Form Modal */}
      {showManualForm && (
        <ManualTaskForm
          manualTask={manualTask}
          setManualTask={(updater) => dispatch({ type: 'UPDATE_MANUAL_TASK', updater })}
          subtaskInput={subtaskInput}
          setSubtaskInput={(value) => dispatch({ type: 'SET_FIELD', field: 'subtaskInput', value })}
          onAddSubtask={addSubtaskToForm}
          onAddNestedSubtask={handleAddNestedSubtask}
          onRemoveNestedSubtask={handleRemoveNestedSubtask}
          onSubmit={submitManualTask}
          onClose={() => dispatch({ type: 'SET_FIELD', field: 'showManualForm', value: false })}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => dispatch({ type: 'SELECT_TASK', task: null })}
          onSetStatus={setTaskStatus}
          onCycleSubtaskStatus={cycleSubtaskStatus}
          onUpdateSubtaskDate={updateSubtaskDate}
          onDrillInto={drillIntoTask}
          onDelete={deleteTask}
        />
      )}

      {/* Floating AI Button (when chat is closed) */}
      {!showChat && objective && (
        <button
          onClick={startGoalDiscussion}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          aria-label="Open AI assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Goals
