import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import AllNotifications from './pages/AllNotifications'
import PriorityInbox from './pages/PriorityInbox'

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button color="inherit" component={Link} to="/">All</Button>
          <Button color="inherit" component={Link} to="/priority">Priority</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
