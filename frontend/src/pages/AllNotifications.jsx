import React, { useEffect, useState } from 'react'
import NotificationItem from '../components/NotificationItem'
import { CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel, Stack, TextField, Button } from '@mui/material'
import Log from '../utils/logger'
import MOCK_NOTIFICATIONS from '../mocks/mockNotifications'
import imgI from '../assets/i.svg'
import imgII from '../assets/ii.svg'

const API = 'http://4.224.186.213/evaluation-service/notifications'

export default function AllNotifications() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('')
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
      Log('AllNotifications', 'INFO', 'frontend', 'fetching notifications')
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
        Log('AllNotifications', 'INFO', 'frontend', 'fetched notifications')
      } catch (err) {
        // Graceful fallback: use mock notifications and avoid showing raw technical errors
        setNotifications(MOCK_NOTIFICATIONS)
        setLoading(false)
        setApiOffline(true)
        Log('AllNotifications', 'WARN', 'frontend', `fetch-fallback: ${String(err)}`)
      }
    }
    load()
  }, [token])

  useEffect(() => {
    localStorage.setItem('readIds', JSON.stringify(Array.from(readSet)))
  }, [readSet])

  function saveToken() {
    setSavingToken(true)
    try {
      localStorage.setItem('API_TOKEN', token)
    } finally {
      setSavingToken(false)
    }
  }

  function toggleRead(item) {
    const id = item.ID || item.id
    const next = new Set(readSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setReadSet(next)
    Log('AllNotifications', 'INFO', 'frontend', `${next.has(id) ? 'read' : 'unread'}:${id}`)
  }

  const filtered = notifications.filter((it) => (filter ? it.Type === filter || it.type === filter : true))

  if (loading) return <CircularProgress />
  // Show a friendly banner if API was unreachable, but still render notifications
  if (apiOffline) {
    // render a non-technical notice but continue to display notifications
    return (
      <div>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">All Notifications</Typography>
          <Typography color="warning.main">Offline mode — showing cached mock notifications</Typography>
        </Stack>
        {filtered.length === 0 && <Typography>No notifications found.</Typography>}
        {filtered.map((n) => (
          <NotificationItem key={n.ID || n.id} item={n} onToggleRead={toggleRead} isRead={readSet.has(n.ID || n.id)} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <img src={imgI} alt="i" style={{ width: 160, height: 'auto', borderRadius: 6 }} />
        <img src={imgII} alt="ii" style={{ width: 160, height: 'auto', borderRadius: 6 }} />
      </div>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">All Notifications</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select value={filter} label="Filter Type" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="API Token"
          size="small"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ minWidth: 360 }}
          helperText="Paste Bearer token and click Save"
        />
        <Button size="small" variant="contained" onClick={saveToken} disabled={savingToken || !token}>
          Save Token
        </Button>
      </Stack>

      {filtered.length === 0 && <Typography>No notifications found.</Typography>}
      {filtered.map((n) => (
        <NotificationItem key={n.ID || n.id} item={n} onToggleRead={toggleRead} isRead={readSet.has(n.ID || n.id)} />
      ))}
    </div>
  )
}
