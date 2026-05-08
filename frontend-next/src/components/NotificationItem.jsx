import React from 'react'
import { ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Typography, Box } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

function timeAgo(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch { return ts }
}

export default function NotificationItem({ notification, onMarkViewed, viewed }) {
  const id = notification.notification_id || notification.id
  const title = notification.title || notification.subject || (notification.notification_type || 'Notification')
  const message = notification.message || notification.body || notification.description || ''
  const type = notification.notification_type || notification.type || 'Event'
  const time = notification.created_at || notification.time || notification.timestamp || notification.date || ''

  return (
    <ListItem
      alignItems="flex-start"
      sx={{ bgcolor: viewed ? 'grey.50' : 'background.paper', borderRadius: 1, mb: 1, cursor: 'pointer' }}
      onClick={() => onMarkViewed(id)}
    >
      <ListItemAvatar>
        <Avatar>
          <NotificationsIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Box display="flex" gap={1} alignItems="center"><Typography variant="subtitle1">{title}</Typography>{!viewed && <Chip label="New" color="primary" size="small" />}</Box>}
        secondary={
          <>
            <Typography variant="body2" color="text.primary">{message}</Typography>
            <Box mt={0.5} display="flex" gap={1} alignItems="center">
              <Chip label={type} size="small" variant="outlined" />
              <Typography variant="caption" color="text.secondary">{timeAgo(time)}</Typography>
            </Box>
          </>
        }
      />
    </ListItem>
  )
}
