import { useState, useEffect } from 'react'

interface NewsStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
}

interface EventsStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
}

interface UserStats {
  total: number
  admins: number
  editors: number
}

interface StatsData {
  news: NewsStats | null
  events: EventsStats | null
  users: UserStats | null
  loading: boolean
  error: string | null
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    news: null,
    events: null,
    users: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }))

        const [newsResponse, eventsResponse, usersResponse] = await Promise.all([
          fetch('/api/news/stats'),
          fetch('/api/events/stats'),
          fetch('/api/users/stats')
        ])

        if (!newsResponse.ok || !eventsResponse.ok || !usersResponse.ok) {
          throw new Error('Error al obtener estadísticas')
        }

        const [newsData, eventsData, usersData] = await Promise.all([
          newsResponse.json(),
          eventsResponse.json(),
          usersResponse.json()
        ])

        setStats({
          news: newsData,
          events: eventsData,
          users: usersData,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al obtener estadísticas'
        }))
      }
    }

    fetchStats()
  }, [])

  return stats
}
