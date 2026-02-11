# Deployment

## Development
- Create server/.env based on .env.example.
- Run locally:
  - cd server
  - npm install
  - npm run dev
- Optional: expose with Ngrok
  - npx ngrok config add-authtoken <token>
  - npx ngrok http 3010

## Production
- Prepare environment variables (see docs/CONFIGURATION.md).
- Use a process manager:
  - pm2 start npm --name "otp-backend" -- start
  - or create a Systemd unit that runs npm start in server directory.
- TLS and domain:
  - Deploy behind a reverse proxy (Nginx/Caddy) with HTTPS.
  - Set CORS_ORIGIN to your frontend domain.
- Observability:
  - Collect logs; monitor 4xx/5xx rates and request volume.
  - Consider external rate limiting at proxy/CDN.
- Secrets:
  - Inject via environment; never commit tokens.

## Testing Before Release
- npm run lint
- npm test
- Dry-run mode enabled for staging; disable in production when ready.
