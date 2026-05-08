import React from 'react'
import { Box, List, Pagination, Button, Stack, Alert } from '@mui/material'
import NotificationItem from './NotificationItem'

export default function NotificationList({ notifications = [], loading, error, page = 1, setPage = () => {}, limit = 10, onMarkViewed = () => {}, viewedIds = [], showPagination = true }) {
  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {notifications.map(n => (
          <NotificationItem key={n.notification_id || n.id || JSON.stringify(n)} notification={n} onMarkViewed={onMarkViewed} viewed={viewedIds.includes(n.notification_id || n.id)} />
        ))}
      </List>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
        <Button onClick={() => { localStorage.removeItem('viewedNotifications'); window.location.reload() }}>Reset Viewed</Button>
        {showPagination && (
          <Pagination count={10} page={page} onChange={(e, p) => setPage(p)} color="primary" />
        )}
      </Stack>
    </Box>
  )
}
