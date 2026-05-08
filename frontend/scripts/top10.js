const axios = require('axios')

const API = 'http://4.224.186.213/evaluation-service/notifications'

const WEIGHT = { Placement: 3, Result: 2, Event: 1 }

function scoreNotification(n) {
  const weight = WEIGHT[n.Type] || WEIGHT[n.type] || 0
  const ts = new Date(n.Timestamp || n.timestamp || n.timestamp_ms || '').getTime() || 0
  return weight * 1e13 + ts
}

async function fetchAndPrintTop10() {
  try {
    const token = process.env.BEARER_TOKEN || process.env.ACCESS_TOKEN
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await axios.get(API, { headers })
    const data = res.data
    const notifications = data.notifications || data
    if (!Array.isArray(notifications)) {
      console.error('Unexpected response shape:', typeof notifications)
      process.exit(1)
    }

    const top10 = notifications
      .map((it) => ({ ...it, _score: scoreNotification(it) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 10)

    console.log('Top 10 Notifications:')
    top10.forEach((n, i) => {
      console.log(`${i + 1}. ID=${n.ID || n.id} Type=${n.Type || n.type} Timestamp=${n.Timestamp || n.timestamp} Message=${n.Message || n.message}`)
    })

    // output written to console only (no files)
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error('Failed to fetch notifications: 401 Unauthorized - invalid authorization token')
    } else {
      console.error('Failed to fetch notifications:', err.message || err)
    }
    process.exit(1)
  }
}

fetchAndPrintTop10()
