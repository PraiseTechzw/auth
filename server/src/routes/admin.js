const express = require('express')
const { setDryRun, isDryRun } = require('../config')

const router = express.Router()

router.post('/dry-run', (req, res) => {
  const { enabled } = req.body || {}
  setDryRun(Boolean(enabled))
  return res.json({ success: true, dryRun: isDryRun() })
})

module.exports = router
