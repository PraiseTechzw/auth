# Auth: OTP Verification Backend and Client

Production-ready OTP verification with:
- Node.js/Express backend in server
- Universal client in packages/otp-client
- SMS POP integration for OTP delivery
- Dry-run testing mode toggleable at runtime

## Prerequisites
- Node.js 18+ and npm
- Optional: Ngrok for device connectivity during development
- SMS POP account with approved Sender ID and API token

## Installation
- Backend
  - Create server/.env based on [server/.env.example](file:///c:/Users/Prais/projects/auth/server/.env.example)
    - PORT=3010
    - CORS_ORIGIN=*
    - SMSPOP_TOKEN=<your_token>
    - SMSPOP_SENDER_ID=<approved_sender_id>
    - OTP_PEPPER=<random_secret_string>
    - DRY_RUN_SMS=true
  - Install and run:
    - cd server
    - npm install
    - npm start
- Client (optional)
  - cd packages/otp-client
  - npm install

## Quick Usage
- Health check:

```bash
curl http://localhost:3010/health
```

- Request OTP:

```bash
curl -X POST http://localhost:3010/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"0786123456"}'
```

- Verify OTP:

```bash
curl -X POST http://localhost:3010/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"0786123456","otp":"123456"}'
```

- Toggle dry-run at runtime:

```bash
curl -X POST http://localhost:3010/admin/dry-run \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

## Configuration
- Environment variables defined in [config.js](file:///c:/Users/Prais/projects/auth/server/src/config.js)
  - smsToken from SMSPOP_TOKEN
  - smsSenderId from SMSPOP_SENDER_ID
  - otpPepper from OTP_PEPPER
  - dryRunSms from DRY_RUN_SMS
  - resendCooldownMs, otpExpireMs, rate limits
- Admin toggle endpoint implemented in [admin.js](file:///c:/Users/Prais/projects/auth/server/src/routes/admin.js)

## API Reference
- Full details in docs/API.md
- Key server files:
  - App: [app.js](file:///c:/Users/Prais/projects/auth/server/src/app.js)
  - Auth routes: [auth.js](file:///c:/Users/Prais/projects/auth/server/src/routes/auth.js)
  - SMS service: [sms.js](file:///c:/Users/Prais/projects/auth/server/src/services/sms.js)
  - Phone normalization: [phone.js](file:///c:/Users/Prais/projects/auth/server/src/utils/phone.js)
  - OTP utilities: [otp.js](file:///c:/Users/Prais/projects/auth/server/src/utils/otp.js)
  - In-memory store: [memoryStore.js](file:///c:/Users/Prais/projects/auth/server/src/store/memoryStore.js)

## Testing
- Run tests:
  - cd server
  - npm test
- Example tests in [auth.test.js](file:///c:/Users/Prais/projects/auth/server/test/auth.test.js)

## Architecture
- See docs/ARCHITECTURE.md for data flow, modules, and design decisions.

## Deployment
- See docs/DEPLOYMENT.md for procedures in development and production.

## Troubleshooting
- See docs/TROUBLESHOOTING.md for common issues and fixes.

## Contributing
- Please read [CONTRIBUTING.md](file:///c:/Users/Prais/projects/auth/CONTRIBUTING.md) for guidelines on opening issues and PRs, coding standards, and testing.

## License
- MIT (or project-specific). Update as appropriate.
