const axios = require('axios')

const API = 'http://4.224.186.213/evaluation-service/notifications'
const AUTH = 'http://4.224.186.213/evaluation-service/auth'

const WEIGHT = { Placement: 3, Result: 2, Event: 1 }

function scoreNotification(n) {
  const weight = WEIGHT[n.Type] || WEIGHT[n.type] || 0
  const ts = new Date(n.Timestamp || n.timestamp || '').getTime() || 0
  return weight * 1e13 + ts
}

async function obtainTokenFromEnvOrAuth() {
  const token = process.env.BEARER_TOKEN || process.env.ACCESS_TOKEN
  if (token) return token

  // Try to authenticate using provided fields
  const body = {}
  const keys = ['email', 'name', 'rollNo', 'accessCode', 'clientID', 'clientSecret']
  let hasAny = false
  for (const k of keys) {
    const env = process.env[k.toUpperCase()]
    if (env) {
      body[k] = env
      hasAny = true
    }
  }
  if (!hasAny) return null

  try {
    const res = await axios.post(AUTH, body, { headers: { 'Content-Type': 'application/json' } })
    const data = res.data
    // token might be under 'access token' or 'accessToken'
    return data['access token'] || data.accessToken || (data.token_type && data['access token'] ? data['access token'] : null)
  } catch (err) {
    console.error('Auth failed:', err.response ? `${err.response.status} ${err.response.statusText}` : err.message)
    return null
  }
}

async function fetchTop10() {
  const token = await obtainTokenFromEnvOrAuth()
  if (!token) {
    console.error('No token found. Set BEARER_TOKEN or provide auth env vars (EMAIL, NAME, ROLLNO, ACCESSCODE, CLIENTID, CLIENTSECRET).')
    process.exit(1)
  }

  try {
    const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } })
    const notifications = res.data.notifications || res.data
    if (!Array.isArray(notifications)) {
      console.error('Unexpected response:', res.data)
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
    if (err.response && err.response.status === 401) console.error('401 Unauthorized - invalid token')
    else console.error('Fetch failed:', err.message || err)
    process.exit(1)
  }
}

fetchTop10()
