import React, { useEffect, useState } from 'react'
import { Container, Typography, Stack, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import NotificationList from '../src/components/NotificationList'
import { fetchNotifications } from '../src/lib/api'
import Link from 'next/link'

export default function Priority() {
  const [type, setType] = useState('')
  const [limit, setLimit] = useState(5)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('viewedNotifications') || '[]') } catch { return [] }
  })

  useEffect(() => {
    setLoading(true)
    fetchNotifications({ limit, page: 1, type: type || undefined })
      .then(data => setNotifications(data || []))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [limit, type])

  function markViewed(id) {
    const next = Array.from(new Set([...viewed, id]))
    setViewed(next)
    localStorage.setItem('viewedNotifications', JSON.stringify(next))
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Priority Notifications</Typography>
        <Link href="/" passHref><Button variant="outlined">All</Button></Link>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="ptype-label">Notification Type</InputLabel>
          <Select labelId="ptype-label" label="Notification Type" value={type} onChange={e => setType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Top N" type="number" size="small" value={limit} onChange={e => setLimit(Math.max(1, Number(e.target.value || 1)))} sx={{ width: 120 }} />
      </Stack>

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        page={1}
        setPage={() => {}}
        limit={limit}
        onMarkViewed={markViewed}
        viewedIds={viewed}
        showPagination={false}
      />
    </Container>
  )
}
