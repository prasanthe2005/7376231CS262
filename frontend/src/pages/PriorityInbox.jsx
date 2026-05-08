import React, { useEffect, useState } from 'react'
import { getTopNotifications } from '../utils/priority'
import NotificationItem from '../components/NotificationItem'
import { CircularProgress, Typography, TextField, Stack, Button } from '@mui/material'
import Log from '../utils/logger'
import MOCK_NOTIFICATIONS from '../mocks/mockNotifications'

const API = 'http://4.224.186.213/evaluation-service/notifications'

export default function PriorityInbox() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [n, setN] = useState(10)
  const [readSet, setReadSet] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('readIds') || '[]'))
    } catch (e) {
      return new Set()
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('API_TOKEN') || '')
  const [savingToken, setSavingToken] = useState(false)
  const [apiOffline, setApiOffline] = useState(false)

  useEffect(() => {
    async function load() {
      Log('PriorityInbox', 'INFO', 'frontend', 'fetching notifications')
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(API, { headers })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`${res.status} ${res.statusText} - ${text}`)
        }
        const data = await res.json()
        setNotifications(data.notifications || data)
        setLoading(false)
        setApiOffline(false)
        Log('PriorityInbox', 'INFO', 'frontend', 'fetched notifications')
      } catch (err) {
        // fallback to mock notifications and show friendly notice
        setNotifications(MOCK_NOTIFICATIONS)
        setLoading(false)
        setApiOffline(true)
        Log('PriorityInbox', 'WARN', 'frontend', `fetch-fallback: ${String(err)}`)
      }
    }
    load()
  }, [token])

  function toggleRead(item) {
    const id = item.ID || item.id
    const next = new Set(readSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setReadSet(next)
    localStorage.setItem('readIds', JSON.stringify(Array.from(next)))
  }

  function saveToken() {
    setSavingToken(true)
    try {
      localStorage.setItem('API_TOKEN', token)
    } finally {
      setSavingToken(false)
    }
  }

  if (loading) return <CircularProgress />

  const offlineBanner = apiOffline ? <Typography color="warning.main" sx={{ mb: 1 }}>Offline mode — showing mock notifications</Typography> : null

  const top = getTopNotifications(notifications, Number(n || 10))

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Priority Inbox (Top {n})</Typography>
        <TextField label="Top N" size="small" value={n} onChange={(e) => setN(e.target.value)} sx={{ width: 120 }} />
        <TextField label="API Token" size="small" value={token} onChange={(e) => setToken(e.target.value)} sx={{ minWidth: 360 }} helperText="Paste Bearer token and click Save" />
        <Button size="small" variant="contained" onClick={saveToken} disabled={savingToken || !token}>Save Token</Button>
      </Stack>
      {offlineBanner}
      {top.length === 0 && <Typography>No priority notifications.</Typography>}
      {top.map((n) => (
        <NotificationItem key={n.ID || n.id} item={n} onToggleRead={toggleRead} isRead={readSet.has(n.ID || n.id)} />
      ))}
    </div>
  )
}
