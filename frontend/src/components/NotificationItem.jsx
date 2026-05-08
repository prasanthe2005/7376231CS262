import React from 'react'
import { Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material'

export default function NotificationItem({ item, onToggleRead, isRead }) {
  return (
    <Card sx={{ mb: 2, opacity: isRead ? 0.6 : 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="subtitle2">{item.Type || item.type}</Typography>
            <Typography variant="body1">{item.Message || item.message || '(no message)'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {item.Timestamp || item.timestamp}
            </Typography>
          </div>
          <div>
            <Chip label={isRead ? 'Read' : 'New'} color={isRead ? 'default' : 'primary'} sx={{ mr: 1 }} />
            <Button size="small" onClick={() => onToggleRead(item)}>
              {isRead ? 'Mark Unread' : 'Mark Read'}
            </Button>
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}
