const ngrok = require('ngrok')
const fs = require('fs')
const path = require('path')

async function run() {
  const port = 3010
  const opts = { addr: port, authtoken: process.env.NGROK_AUTHTOKEN, proto: 'http' }
  try {
    const url = await ngrok.connect(opts)
    console.log('ngrok url', url)
    const cfgPath = path.resolve(__dirname, '../../app-expo/src/config.json')
    const cfg = { apiUrl: url }
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2))
    console.log('wrote config', cfgPath)
  } catch (e) {
    console.error('ngrok failed', e && e.message ? e.message : e)
    process.exit(1)
  }
}

run()
