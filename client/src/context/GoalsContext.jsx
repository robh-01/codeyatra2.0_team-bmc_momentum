import React, { createContext, useContext, useReducer } from 'react'

const GoalsContext = createContext()

// ── Reducer ──────────────────────────────────────────────────────
function goalsContextReducer(state, action) {
  switch (action.type) {
    case 'ADD_GOAL':
      return [...state, action.goal]
    case 'UPDATE_GOAL_TASKS':
      return state.map(g => (g.id === action.goalId ? { ...g, tasks: action.tasks } : g))
    case 'REMOVE_GOAL':
      return state.filter(g => g.id !== action.goalId)
    case 'SET_GOALS':
      return action.goals
    default:
      return state
  }
}

export const GoalsProvider = ({ children }) => {
  const [goals, dispatch] = useReducer(goalsContextReducer, [])

  // Add a new goal (objective + its tasks)
  const addGoal = (objective, tasks) => {
    const newGoal = {
      id: Date.now(),
      objective,
      tasks,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_GOAL', goal: newGoal })
    return newGoal
  }

  // Update tasks for an existing goal
  const updateGoalTasks = (goalId, tasks) => {
    dispatch({ type: 'UPDATE_GOAL_TASKS', goalId, tasks })
  }

  // Remove a goal
  const removeGoal = (goalId) => {
    dispatch({ type: 'REMOVE_GOAL', goalId })
  }

  // Set all goals
  const setGoals = (goals) => {
    dispatch({ type: 'SET_GOALS', goals })
  }

  return (
    <GoalsContext.Provider value={{ goals, setGoals, addGoal, updateGoalTasks, removeGoal }}>
      {children}
    </GoalsContext.Provider>
  )
}

export const useGoals = () => {
  const ctx = useContext(GoalsContext)
  if (!ctx) throw new Error('useGoals must be used within a GoalsProvider')
  return ctx
}
