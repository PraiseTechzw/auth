# Architecture

## Overview
- Server: Node.js/Express application that exposes OTP endpoints and integrates with SMS POP.
- Client: packages/otp-client provides fetch-based helpers to call server endpoints.

## Modules
- App: [app.js](file:///c:/Users/Prais/projects/auth/server/src/app.js)
  - Express app setup, CORS, JSON body parsing, routes, error handler.
- Routes:
  - Auth: [auth.js](file:///c:/Users/Prais/projects/auth/server/src/routes/auth.js)
    - request-otp and verify-otp endpoints.
  - Admin: [admin.js](file:///c:/Users/Prais/projects/auth/server/src/routes/admin.js)
    - runtime toggle for dry-run mode.
- Services:
  - SMS: [sms.js](file:///c:/Users/Prais/projects/auth/server/src/services/sms.js)
    - Sends messages to SMS POP; maps provider responses and errors.
- Store:
  - Memory store: [memoryStore.js](file:///c:/Users/Prais/projects/auth/server/src/store/memoryStore.js)
    - Holds OTP records, cooldowns, request logs, attempts.
- Utils:
  - Phone: [phone.js](file:///c:/Users/Prais/projects/auth/server/src/utils/phone.js)
    - Zimbabwe phone normalization.
  - OTP: [otp.js](file:///c:/Users/Prais/projects/auth/server/src/utils/otp.js)
    - Secure random 6-digit generation and SHA-256 hashing with pepper.
- Config: [config.js](file:///c:/Users/Prais/projects/auth/server/src/config.js)
  - Centralized environment configuration and dry-run override helpers.
- Entrypoint: [server.js](file:///c:/Users/Prais/projects/auth/server/src/server.js)
  - Starts Express server on configured port.

## Data Flow
- request-otp:
  - Normalize phone → check rate limit/cooldown → generate OTP → hash with pepper → persist in memory store → send via SMS POP (or dry-run) → respond with metadata.
- verify-otp:
  - Normalize phone → hash provided OTP → compare with stored hash → update attempts → success or error with remaining attempts.

## Security Considerations
- OTP hashing with pepper to avoid storing the raw code.
- Rate limiting and cooldowns to reduce abuse.
- No secrets committed; configuration via environment variables.
- CORS origin configurable.

## Client Library (otp-client)
- Functions: health, requestOtp, verifyOtp.
- Base URL:
  - Derived from setBaseUrl, persisted via attachStorage, or OTP_BASE_URL env.
- Types: [index.d.ts](file:///c:/Users/Prais/projects/auth/packages/otp-client/src/index.d.ts)
