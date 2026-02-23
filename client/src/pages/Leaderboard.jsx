import React, { useState, useMemo } from 'react'

// ─── Badge registry (one per user) ───────────────────────────────────────────
const BADGES = {
  first_mission: { label: 'First Mission', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  iron_week: { label: 'Iron Week', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  deep_work: { label: 'Deep Work', color: 'bg-violet-50 text-violet-600 border-violet-200' },
  goal_crusher: { label: 'Goal Crusher', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  course_corrector: { label: 'Course Corrector', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  on_the_path: { label: 'On the Path', color: 'bg-sky-50 text-sky-700 border-sky-200' },
}

// ─── User data ────────────────────────────────────────────────────────────────
const ME_ID = 'me'

const USERS = [
  { id: 'u1', name: 'Aarav Sharma', initials: 'AS', category: 'Career', streak: 24, score: 97, pts: 2100, ptsTrend: +180, badge: 'goal_crusher', rank: 1 },
  { id: 'u2', name: 'Priya Thapa', initials: 'PT', category: 'Fitness', streak: 18, score: 92, pts: 1890, ptsTrend: +95, badge: 'deep_work', rank: 2, duelWith: ME_ID, duelDaysLeft: 3 },
  { id: 'u3', name: 'Sagar Karki', initials: 'SK', category: 'Learning', streak: 12, score: 85, pts: 1560, ptsTrend: +60, badge: 'iron_week', rank: 3 },
  { id: ME_ID, name: 'Alex Rivera', initials: 'AR', category: 'Learning', streak: 7, score: 88, pts: 1240, ptsTrend: +120, badge: 'iron_week', rank: 4, isYou: true, duelWith: 'u2', duelDaysLeft: 3 },
  { id: 'u5', name: 'Nisha Shrestha', initials: 'NS', category: 'Career', streak: 15, score: 81, pts: 1100, ptsTrend: -40, badge: 'course_corrector', rank: 5 },
  { id: 'u6', name: 'Bikash Tamang', initials: 'BT', category: 'Habits', streak: 9, score: 76, pts: 980, ptsTrend: +30, badge: 'on_the_path', rank: 6 },
  { id: 'u7', name: 'Anisha Gurung', initials: 'AG', category: 'Fitness', streak: 5, score: 70, pts: 840, ptsTrend: -20, badge: 'first_mission', rank: 7 },
]

const FRIENDS_IDS = ['u2', 'u3', 'u5']

const PERSONAL_WEEKS = [
  { label: '4 weeks ago', score: 72, pts: 880, streak: 3 },
  { label: '3 weeks ago', score: 80, pts: 970, streak: 5 },
  { label: '2 weeks ago', score: 65, pts: 790, streak: 2 },
  { label: 'Last week', score: 91, pts: 1140, streak: 6 },
  { label: 'This week', score: 88, pts: 1240, streak: 7, current: true },
]

// ─── helpers ──────────────────────────────────────────────────────────────────
const rankLabel = (r) => r === 1 ? '1st' : r === 2 ? '2nd' : r === 3 ? '3rd' : `${r}th`

function Avatar({ initials, size = 'md', isYou }) {
  const sz = size === 'lg' ? 'w-11 h-11 text-sm' : 'w-9 h-9 text-xs'
  return (
    <div className={`${sz} rounded-lg ${isYou ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'} flex items-center justify-center font-semibold shrink-0 tracking-wide`}>
      {initials}
    </div>
  )
}

function BadgePill({ badgeKey }) {
  const b = BADGES[badgeKey]
  if (!b) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${b.color} whitespace-nowrap`}>
      {b.label}
    </span>
  )
}

function TrendLabel({ val }) {
  if (val === 0) return <span className="text-xs text-gray-400">—</span>
  return val > 0 ? (
    <span className="text-xs font-medium text-emerald-600">+{val}</span>
  ) : (
    <span className="text-xs font-medium text-red-400">{val}</span>
  )
}

// ─── CompareModal ─────────────────────────────────────────────────────────────
function CompareModal({ user, me, onClose }) {
  const rows = [
    { label: 'Consistency Score', mine: me.score, theirs: user.score, suffix: '' },
    { label: 'Current Streak', mine: me.streak, theirs: user.streak, suffix: 'd' },
    { label: 'Weekly Points', mine: me.pts, theirs: user.pts, suffix: '' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Compare</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Users */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 px-6 py-5">
          <div className="pr-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Avatar initials={me.initials} isYou />
              <div>
                <p className="text-sm font-semibold text-gray-900">{me.name}</p>
                <p className="text-xs text-indigo-600">You · #{me.rank}</p>
              </div>
            </div>
          </div>
          <div className="pl-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Avatar initials={user.initials} />
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">#{user.rank}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison rows */}
        <div className="px-6 pb-4 space-y-3">
          {rows.map(row => {
            const iwin = row.mine >= row.theirs
            const myPct = Math.round((row.mine / (row.mine + row.theirs)) * 100)
            const thPct = 100 - myPct
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold tabular-nums ${iwin ? 'text-gray-900' : 'text-gray-400'}`}>
                    {row.mine.toLocaleString()}{row.suffix}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{row.label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${!iwin ? 'text-gray-900' : 'text-gray-400'}`}>
                    {row.theirs.toLocaleString()}{row.suffix}
                  </span>
                </div>
                <div className="flex h-1.5 gap-0.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-l-full ${iwin ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ width: `${myPct}%` }} />
                  <div className={`h-full rounded-r-full ${!iwin ? 'bg-gray-600' : 'bg-gray-100'}`} style={{ width: `${thPct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          {me.duelWith === user.id ? (
            <div className="flex items-center justify-between py-2.5 px-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-sm font-medium text-amber-700">Active challenge — {me.duelDaysLeft} days left</span>
              <span className="text-xs font-semibold text-amber-600">Ongoing</span>
            </div>
          ) : (
            <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors">
              Start 7-Day Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────────────
function Row({ user, me, onCompare, showCompare }) {
  const isTop3 = user.rank <= 3
  const inDuel = user.duelWith === ME_ID

  return (
    <tr
      className={`group border-b border-gray-50 transition-colors ${user.isYou
        ? 'bg-indigo-50/60'
        : 'hover:bg-gray-50/80'
        }`}
    >
      {/* Rank */}
      <td className="py-3.5 pl-5 pr-3 w-12">
        <span className={`text-sm font-semibold tabular-nums ${user.rank === 1 ? 'text-amber-500' :
          user.rank === 2 ? 'text-gray-500' :
            user.rank === 3 ? 'text-orange-500' :
              user.isYou ? 'text-indigo-600' : 'text-gray-400'
          }`}>
          {rankLabel(user.rank)}
        </span>
      </td>

      {/* User */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} size="md" isYou={user.isYou} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium truncate ${user.isYou ? 'text-indigo-700' : 'text-gray-900'}`}>
                {user.name}
              </span>
              {user.isYou && (
                <span className="shrink-0 text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">you</span>
              )}
              {inDuel && !user.isYou && (
                <span className="shrink-0 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">dueling</span>
              )}
            </div>

          </div>
        </div>
      </td>

      {/* Badge */}
      <td className="py-3.5 pr-4 hidden md:table-cell">
        <BadgePill badgeKey={user.badge} />
      </td>

      {/* Streak */}
      <td className="py-3.5 pr-4 hidden sm:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800 tabular-nums">{user.streak}</span>
          <span className="text-xs text-gray-400">days</span>
        </div>
      </td>

      {/* Score */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold tabular-nums ${user.isYou ? 'text-indigo-700' : 'text-gray-800'}`}>
            {user.score}
          </span>
          <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
            <div
              className={`h-full rounded-full ${user.isYou ? 'bg-indigo-500' : 'bg-gray-300'}`}
              style={{ width: `${user.score}%` }}
            />
          </div>
        </div>
      </td>

      {/* Points */}
      <td className="py-3.5 pr-4 hidden sm:table-cell">
        <div>
          <span className="text-sm font-semibold text-gray-800 tabular-nums">{user.pts.toLocaleString()}</span>
          <div className="mt-0.5">
            <TrendLabel val={user.ptsTrend} />
          </div>
        </div>
      </td>

      {/* Action */}
      <td className="py-3.5 pr-5 w-20 text-right">
        {!user.isYou && showCompare && (
          <button
            onClick={() => onCompare(user)}
            className="text-xs font-medium text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
          >
            Compare
          </button>
        )}
      </td>
    </tr>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Leaderboard = () => {
  const [tab, setTab] = useState('global')
  const [compare, setCompare] = useState(null)

  const stored = JSON.parse(localStorage.getItem('user') || '{"name":"Alex Rivera"}')
  const me = useMemo(() => {
    const u = USERS.find(u => u.isYou)
    return { ...u, name: stored.name || u.name, initials: (stored.name || u.name).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }
  }, [stored.name])

  const allUsers = USERS.map(u => u.isYou ? me : u)
  const friends = allUsers.filter(u => FRIENDS_IDS.includes(u.id))
  const duelFriend = friends.find(f => f.duelWith === ME_ID)

  const colHeaders = [
    { label: 'Rank', cls: '' },
    { label: 'User', cls: '' },
    { label: 'Badge', cls: 'hidden md:table-cell' },
    { label: 'Streak', cls: 'hidden sm:table-cell' },
    { label: 'Score', cls: '' },
    { label: 'Points', cls: 'hidden sm:table-cell' },
    { label: '', cls: '' },
  ]

  const TableShell = ({ rows, showCompare }) => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            {colHeaders.map((h, i) => (
              <th key={i} className={`py-2.5 pl-${i === 0 ? '5' : '0'} pr-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider ${h.cls}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(user => (
            <Row key={user.id} user={user} me={me} onCompare={setCompare} showCompare={showCompare} />
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Season · Focus Fall</span>
              <span className="text-[10px] text-gray-400">12 days left</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Ranked by weekly consistency score.</p>
          </div>

          {/* Community progress */}
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm min-w-[200px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Community XP</span>
              <span className="text-xs font-semibold text-gray-700">68%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">34,000 / 50,000 XP · Season goal</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 mb-5 border-b border-gray-200">
          {['global', 'friends', 'personal'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${tab === t
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ════════ GLOBAL ════════ */}
        {tab === 'global' && (
          <div className="space-y-4">
            <TableShell rows={allUsers} showCompare />

            {/* My pinned row if outside top 10 */}
            {!allUsers.slice(0, 10).some(u => u.isYou) && (
              <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody>
                    <Row user={{ ...me, rank: 42 }} me={me} onCompare={setCompare} showCompare />
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════ FRIENDS ════════ */}
        {tab === 'friends' && (
          <div className="space-y-4">
            {/* Active duel card */}
            {duelFriend && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Active Challenge</span>
                  <span className="text-xs text-gray-400">{me.duelDaysLeft} days remaining</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5 flex-1">
                    <Avatar initials={me.initials} isYou />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{me.name}</p>
                      <p className="text-xs font-semibold text-indigo-600">{me.pts.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-300">vs</span>
                  <div className="flex items-center gap-2.5 flex-1 justify-end">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{duelFriend.name}</p>
                      <p className="text-xs font-semibold text-gray-500">{duelFriend.pts.toLocaleString()} pts</p>
                    </div>
                    <Avatar initials={duelFriend.initials} />
                  </div>
                </div>
                {/* Race bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  {(() => {
                    const myPct = Math.round(me.pts / (me.pts + duelFriend.pts) * 100)
                    return (
                      <>
                        <div className="h-full bg-indigo-600 rounded-l-full" style={{ width: `${myPct}%` }} />
                        <div className="h-full bg-gray-300 flex-1" />
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Friends table */}
            {friends.length > 0 ? (
              <TableShell rows={friends} showCompare />
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-12 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">No connections yet</p>
                <p className="text-xs text-gray-400 mb-4">Add friends to compare progress and start challenges.</p>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
                  Find Friends
                </button>
              </div>
            )}

            {/* Your row */}
            <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-2 border-b border-gray-50">
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Your Standing</span>
              </div>
              <table className="w-full text-left">
                <tbody>
                  <Row user={me} me={me} onCompare={setCompare} showCompare={false} />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════ PERSONAL ════════ */}
        {tab === 'personal' && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Best Score', value: '91', sub: '4 weeks ago' },
                { label: 'This Week', value: '88', sub: 'Current' },
                { label: 'Avg Score', value: '80', sub: 'Past 5 weeks' },
                { label: 'Total Points', value: '4,980', sub: 'Past 5 weeks' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs font-medium text-gray-600 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-gray-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Mini bar chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Consistency Score — 5 Weeks</p>
              <div className="flex items-end gap-3 h-24">
                {PERSONAL_WEEKS.map((w, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className={`text-[10px] font-semibold ${w.current ? 'text-indigo-600' : 'text-gray-400'}`}>{w.score}</span>
                    <div
                      className="w-full rounded-sm"
                      style={{
                        height: `${w.score}%`,
                        background: w.current ? '#4f46e5' : '#e5e7eb',
                      }}
                    />
                    <span className="text-[9px] text-gray-400 text-center leading-tight">{w.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Week rows */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Period', 'Score', 'Points', 'Streak'].map(h => (
                      <th key={h} className="py-2.5 px-5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider first:pl-5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...PERSONAL_WEEKS].reverse().map((w, i) => (
                    <tr key={i} className={`border-b border-gray-50 last:border-0 ${w.current ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{w.label}</span>
                          {w.current && <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">current</span>}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold tabular-nums ${w.current ? 'text-indigo-700' : 'text-gray-800'}`}>{w.score}</span>
                          <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${w.current ? 'bg-indigo-500' : 'bg-gray-300'}`} style={{ width: `${w.score}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-sm font-medium text-gray-800 tabular-nums">{w.pts.toLocaleString()}</td>
                      <td className="py-3 px-5 text-sm text-gray-600">{w.streak}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI note */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">AI Insight</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your best weeks follow a consistent morning session. You're 3 points from your personal best — this week could be your record.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compare modal */}
      {compare && <CompareModal user={compare} me={me} onClose={() => setCompare(null)} />}
    </div>
  )
}

export default Leaderboard