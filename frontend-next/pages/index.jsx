import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, Select, MenuItem, FormControl, InputLabel, Button, Stack } from '@mui/material'
import NotificationList from '../src/components/NotificationList'
import { fetchNotifications } from '../src/lib/api'
import Link from 'next/link'

export default function Home() {
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewed, setViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('viewedNotifications') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchNotifications({ limit, page, type: type || undefined })
      .then(data => {
        setNotifications(data || [])
      })
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [type, page, limit])

  function markViewed(id) {
    const next = Array.from(new Set([...viewed, id]))
    setViewed(next)
    localStorage.setItem('viewedNotifications', JSON.stringify(next))
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">All Notifications</Typography>
        <Stack direction="row" spacing={2}>
          <Link href="/priority" passHref><Button variant="outlined">Priority</Button></Link>
        </Stack>
      </Stack>

      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="type-label">Notification Type</InputLabel>
          <Select labelId="type-label" label="Notification Type" value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        limit={limit}
        onMarkViewed={markViewed}
        viewedIds={viewed}
      />
    </Container>
  )
}
