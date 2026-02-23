import React, { useState } from 'react'

const CompareModal = ({ isOpen, friend, userData, onClose, getBadgeIcon, getTrendIcon }) => {
  if (!isOpen || !friend) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Comparison</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Friend's Stats */}
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${friend.avatarBg}`}>
                  {friend.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{friend.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{friend.goalCategory}</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Rank</span>
                  <span className="font-semibold text-sm md:text-base">#{friend.rank}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Streak</span>
                  <span className="font-semibold text-sm md:text-base text-orange-500">🔥 {friend.streak} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Consistency</span>
                  <span className="font-semibold text-sm md:text-base">{friend.consistencyScore}/100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Weekly Points</span>
                  <span className="font-semibold text-sm md:text-base">{friend.weeklyPoints} pts {getTrendIcon(friend.trend)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Top Badge</span>
                  <span className="font-semibold text-sm md:text-base">{getBadgeIcon(friend.topBadge)} {friend.topBadge}</span>
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-300">VS</div>
            </div>

            {/* User's Stats */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${userData.avatarBg}`}>
                  {userData.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{userData.name} (You)</h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{userData.goalCategory}</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Rank</span>
                  <span className="font-semibold text-sm md:text-base">#{userData.rank}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Streak</span>
                  <span className="font-semibold text-sm md:text-base text-orange-500">🔥 {userData.streak} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Consistency</span>
                  <span className="font-semibold text-sm md:text-base">{userData.consistencyScore}/100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Weekly Points</span>
                  <span className="font-semibold text-sm md:text-base">{userData.weeklyPoints} pts {getTrendIcon(userData.trend)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs md:text-sm text-gray-600">Top Badge</span>
                  <span className="font-semibold text-sm md:text-base">{getBadgeIcon(userData.topBadge)} {userData.topBadge}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Quick Comparison</h4>
            <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
              <div>
                <span className="text-gray-600">Rank Diff: </span>
                <span className={`font-semibold ${friend.rank > userData.rank ? 'text-green-600' : 'text-red-600'}`}>
                  {friend.rank > userData.rank ? '+' : ''}{friend.rank - userData.rank}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Streak: </span>
                <span className={`font-semibold ${friend.streak > userData.streak ? 'text-red-600' : 'text-green-600'}`}>
                  {friend.streak > userData.streak ? '+' : ''}{friend.streak - userData.streak}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Consistency: </span>
                <span className={`font-semibold ${friend.consistencyScore > userData.consistencyScore ? 'text-red-600' : 'text-green-600'}`}>
                  {friend.consistencyScore > userData.consistencyScore ? '+' : ''}{friend.consistencyScore - userData.consistencyScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Points: </span>
                <span className={`font-semibold ${friend.weeklyPoints > userData.weeklyPoints ? 'text-red-600' : 'text-green-600'}`}>
                  {friend.weeklyPoints > userData.weeklyPoints ? '+' : ''}{friend.weeklyPoints - userData.weeklyPoints}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global')
  const [compareModal, setCompareModal] = useState({ isOpen: false, friend: null })
  const userItem = JSON.parse(localStorage.getItem('user') || '{"name": "Alex Rivera"}')
  const userName = userItem.name || 'Alex Rivera'

  // Mock data for global leaderboard
  const globalRankings = [
    {
      rank: 1,
      name: 'Sarah Jenkins',
      avatar: 'SJ',
      avatarBg: 'bg-yellow-500',
      goalCategory: 'Career',
      streak: 24,
      consistencyScore: 95,
      weeklyPoints: 1250,
      trend: 'up',
      topBadge: 'Goal Crusher',
      isYou: false,
      inDuel: false
    },
    {
      rank: 2,
      name: 'Marcus Chen',
      avatar: 'MC',
      avatarBg: 'bg-gray-400',
      goalCategory: 'Learning',
      streak: 18,
      consistencyScore: 88,
      weeklyPoints: 1180,
      trend: 'up',
      topBadge: 'Iron Week',
      isYou: false,
      inDuel: false
    },
    {
      rank: 3,
      name: 'Elena Rodriguez',
      avatar: 'ER',
      avatarBg: 'bg-orange-600',
      goalCategory: 'Fitness',
      streak: 12,
      consistencyScore: 92,
      weeklyPoints: 1120,
      trend: 'down',
      topBadge: 'Deep Work',
      isYou: false,
      inDuel: false
    },
    {
      rank: 4,
      name: 'David Kim',
      avatar: 'DK',
      avatarBg: 'bg-teal-500',
      goalCategory: 'Career',
      streak: 15,
      consistencyScore: 85,
      weeklyPoints: 1050,
      trend: 'up',
      topBadge: 'Course Corrector',
      isYou: false,
      inDuel: false
    },
    {
      rank: 5,
      name: userName,
      avatar: userName.charAt(0) + (userName.includes(' ') ? userName.split(' ')[1].charAt(0) : ''),
      avatarBg: 'bg-indigo-600',
      goalCategory: 'Learning',
      streak: 7,
      consistencyScore: 85,
      weeklyPoints: 950,
      trend: 'up',
      topBadge: 'Iron Week',
      isYou: true,
      inDuel: false
    },
    {
      rank: 5,
      badge: null,
      name: 'David Kim',
      level: 'Level 10 Focus Master',
      avatar: 'DK',
      avatarBg: 'bg-teal-400',
      streak: 15,
      tasks: 310,
      totalXP: '10,900',
      todayXP: '+240',
    },
  ]

  const achievements = [
    { icon: '⭐', label: 'PIONEER', unlocked: true },
    { icon: '🔥', label: 'STREAK KING', unlocked: true },
    { icon: '🧘', label: 'ZEN MASTER', unlocked: true },
    { icon: '🤝', label: 'COLLABORATOR', unlocked: true },
    { icon: '🌙', label: 'NIGHT OWL', unlocked: false },
    { icon: '🌅', label: 'EARLY BIRD', unlocked: false },
    { icon: '👑', label: 'ULTRA PRO', unlocked: false },
    { icon: '💪', label: 'IRON WILL', unlocked: false },
    { icon: '🎓', label: 'MENTOR', unlocked: false },
  ]

  const renderCard = (user, showChallenge = false) => (
    <div className={`bg-white rounded-lg p-3 md:p-4 mb-3 transition-all duration-200 hover:bg-gray-50 border ${
      user.isYou ? 'ring-2 ring-indigo-500 bg-blue-50 border-indigo-200' : 'border-gray-200'
    } ${user.rank <= 3 ? 'border-l-4 border-yellow-500' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="shrink-0">
            {user.rank <= 3 ? (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
              }`}>
                {user.rank}
              </div>
            ) : (
              <span className="text-gray-500 font-bold text-sm">#{user.rank}</span>
            )}
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${user.avatarBg}`}>
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-gray-900 font-semibold text-sm md:text-base truncate">{user.name}</span>
              {user.isYou && <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded shrink-0">You</span>}
              {user.inDuel && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded shrink-0">In Duel</span>}
            </div>
            <div className="text-gray-500 text-xs md:text-sm truncate">{user.goalCategory}</div>
          </div>
        </div>
        {showChallenge && !user.isYou && (
          <button 
            onClick={() => openCompareModal(user)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm px-3 py-1 rounded transition-colors w-full sm:w-auto"
          >
            Compare
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm">
        <div>
          <div className="text-orange-500 text-xs md:text-sm">🔥 {user.streak} days</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs md:text-sm truncate">C: {user.consistencyScore}/100</div>
        </div>
        <div>
          <div className="text-gray-900 text-xs md:text-sm flex items-center">
            {user.weeklyPoints} pts {getTrendIcon(user.trend)}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-xs md:text-sm truncate">
            {getBadgeIcon(user.topBadge)}
          </div>
        </div>
      </div>
      {user.inDuel && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
          <div className="text-red-700 text-xs md:text-sm">VS {user.duelOpponent} • {user.duelDaysLeft} days left</div>
        </div>
      )}
    </div>
  )

  const renderPersonalTab = () => (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-gray-900 text-base md:text-lg font-semibold mb-4">Your Weekly Performance</h3>
      {personalHistory.map((week, index) => (
        <div key={index} className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <span className="text-gray-900 font-semibold text-sm md:text-base">{week.week}</span>
            <span className="text-gray-600 text-xs md:text-sm">{week.points} pts</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2 flex-wrap gap-2">
            <span>Consistency: {week.consistency}/100</span>
            <span>🔥 {week.streak} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${week.consistency}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  )

  const getCurrentRankings = () => {
    switch (activeTab) {
      case 'global':
        return globalRankings
      case 'friends':
        return friendsRankings
      case 'personal':
        return []
      default:
        return globalRankings
    }
  }

  const rankings = getCurrentRankings()

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Leaderboard</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {['global', 'friends', 'personal'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm border' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'personal' ? (
          renderPersonalTab()
        ) : (
          <div className="space-y-3 md:space-y-4">
            {rankings.map(user => 
              renderCard(user, activeTab === 'friends')
            )}
            {activeTab === 'friends' && rankings.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="text-gray-500 text-base md:text-lg mb-2">No friends added yet</div>
                <div className="text-gray-400 text-xs md:text-sm px-4">Connect with others to see their progress and start comparisons!</div>
              </div>
            )}
          </div>
        )}
      </div>
      <CompareModal 
        isOpen={compareModal.isOpen} 
        friend={compareModal.friend} 
        userData={getUserData()} 
        onClose={closeCompareModal}
        getBadgeIcon={getBadgeIcon}
        getTrendIcon={getTrendIcon}
      />
    </div>
  )
}

export default Leaderboard