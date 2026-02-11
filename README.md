# Auth

Production-ready One-Time Password verification with:
- Node.js/Express backend in server
- Universal client in packages/otp-client
- SMS POP integration for OTP delivery
- Dry-run testing mode toggleable at runtime

## Table of Contents
- Overview
- Requirements
- Quick Start
- Configuration
- API
- Client Usage
- Project Structure
- Development
- Testing
- Release & Versioning
- Troubleshooting
- Contributing
- License

## Overview
- Provides endpoints to request and verify OTP codes.
- Normalizes Zimbabwe mobile numbers (0786… → 263786…).
- Enforces cooldowns, rate limits, and max verify attempts.
- Dry-run mode returns debugOtp for local testing without SMS charges.

## Requirements
- Node.js 18+ and npm
- SMS POP account with approved Sender ID and API token (for non-dry-run)
- Optional: Ngrok for device connectivity during development

## Quick Start
- Backend:
  - Create server/.env based on [server/.env.example](file:///c:/Users/Prais/projects/auth/server/.env.example)
  - Install and run:
    - cd server
    - npm install
    - npm start
- Health:

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

- Toggle dry-run:

```bash
curl -X POST http://localhost:3010/admin/dry-run \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

## Configuration
- Environment variables in [config.js](file:///c:/Users/Prais/projects/auth/server/src/config.js):
  - SMSPOP_TOKEN, SMSPOP_SENDER_ID, OTP_PEPPER, DRY_RUN_SMS
  - resendCooldownMs, otpExpireMs, rate limits
- Admin toggle implemented in [admin.js](file:///c:/Users/Prais/projects/auth/server/src/routes/admin.js)

Example server/.env:

```
PORT=3010
CORS_ORIGIN=*
SMSPOP_TOKEN=your-token
SMSPOP_SENDER_ID=YourSender
OTP_PEPPER=your-secret-pepper
DRY_RUN_SMS=true
```

## API
- Full details: docs/API.md
- Key server files:
  - [app.js](file:///c:/Users/Prais/projects/auth/server/src/app.js)
  - [auth.js](file:///c:/Users/Prais/projects/auth/server/src/routes/auth.js)
  - [sms.js](file:///c:/Users/Prais/projects/auth/server/src/services/sms.js)
  - [phone.js](file:///c:/Users/Prais/projects/auth/server/src/utils/phone.js)
  - [otp.js](file:///c:/Users/Prais/projects/auth/server/src/utils/otp.js)
  - [memoryStore.js](file:///c:/Users/Prais/projects/auth/server/src/store/memoryStore.js)

## Client Usage
- Package: packages/otp-client
- Functions:
  - health(), requestOtp(phone), verifyOtp(phone, otp)
- Types: [index.d.ts](file:///c:/Users/Prais/projects/auth/packages/otp-client/src/index.d.ts)

## Project Structure
- server/src organizes concerns with routes, services, utils, and store.
- Clean architecture documentation lives in docs/ARCHITECTURE.md.

## Development
- Lint: npm run lint (server)
- Test: npm test (server)
- Pre-commit runs lint-staged and tests if enabled in your environment.

## Testing
- From server:
  - npm test
- Example tests: [auth.test.js](file:///c:/Users/Prais/projects/auth/server/test/auth.test.js)

## Release & Versioning
- Semantic-version tags (e.g., v1.2.3)
- Automated release workflow generates notes and artifacts
- Changelog: [CHANGELOG.md](file:///c:/Users/Prais/projects/auth/CHANGELOG.md)

## Troubleshooting
- See docs/TROUBLESHOOTING.md

## Contributing
- See [CONTRIBUTING.md](file:///c:/Users/Prais/projects/auth/CONTRIBUTING.md)

## License
- MIT or project-specific (update as needed)
