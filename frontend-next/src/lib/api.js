const BASE = 'http://4.224.186.213/evaluation-service/notifications'

export async function fetchNotifications({ limit = 10, page = 1, type } = {}) {
  const params = new URLSearchParams()
  if (limit) params.set('limit', String(limit))
  if (page) params.set('page', String(page))
  if (type) params.set('notification_type', type)

  const url = `${BASE}?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  // Expecting an array of notifications
  if (!Array.isArray(data)) return []
  return data
}
