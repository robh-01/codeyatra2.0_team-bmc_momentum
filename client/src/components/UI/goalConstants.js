export const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700'
}

export const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50/40',
    border: 'border-amber-200/60',
    ring: 'ring-amber-100',
    icon: '⏳'
  },
  active: {
    label: 'Active',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50/40',
    border: 'border-blue-200/60',
    ring: 'ring-blue-100',
    icon: '▶'
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-200/60',
    ring: 'ring-emerald-100',
    icon: '✓'
  }
}

// Recursively count all subtasks
export const countAllSubtasks = (subs) => {
  if (!subs || subs.length === 0) return { total: 0, completed: 0 }
  let total = subs.length
  let completed = subs.filter(s => s.status === 'completed').length
  subs.forEach(s => {
    const child = countAllSubtasks(s.subtasks)
    total += child.total
    completed += child.completed
  })
  return { total, completed }
}

// Recursively collect all dates from tasks and subtasks
export const collectAllDates = (list) => {
  let dates = []
  for (const t of list) {
    if (t.date) dates.push(new Date(t.date))
    if (t.subtasks && t.subtasks.length > 0) dates = dates.concat(collectAllDates(t.subtasks))
  }
  return dates
}
