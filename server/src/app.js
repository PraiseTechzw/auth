// Express application wiring: CORS, JSON parsing, routes, and error handler.
const express = require('express')
const cors = require('cors')
const { config } = require('./config')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')

const app = express()
app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)

// Fallback error handler to avoid leaking internal errors.
app.use((err, req, res, _next) => {
  res.status(500).json({ success: false, error: 'server_error' })
})

module.exports = { app }
