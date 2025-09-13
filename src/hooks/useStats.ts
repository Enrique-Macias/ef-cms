import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user } = useAuth()
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

        const token = localStorage.getItem('accessToken')
        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        // Always fetch news and events stats (no auth required)
        const [newsResponse, eventsResponse] = await Promise.all([
          fetch('/api/news/stats', { headers }),
          fetch('/api/events/stats', { headers })
        ])

        if (!newsResponse.ok || !eventsResponse.ok) {
          throw new Error('Error al obtener estadísticas')
        }

        const [newsData, eventsData] = await Promise.all([
          newsResponse.json(),
          eventsResponse.json()
        ])

        // Only fetch user stats if user is admin
        let usersData = null
        if (user?.role === 'ADMIN') {
          try {
            const usersResponse = await fetch('/api/users/stats', { headers })
            if (usersResponse.ok) {
              usersData = await usersResponse.json()
            }
          } catch (error) {
            console.warn('Could not fetch user stats:', error)
            // Continue without user stats rather than failing completely
          }
        }

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

    if (user) {
      fetchStats()
    }
  }, [user])

  return stats
}
