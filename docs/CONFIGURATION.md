# Configuration

## Environment Variables (server/.env)
- PORT: server port (default 3000)
- CORS_ORIGIN: allowed origin for CORS (default "*")
- SMSPOP_TOKEN: SMS POP API token (required for real sending)
- SMSPOP_SENDER_ID: approved Sender ID (required for real sending)
- OTP_PEPPER: random secret used when hashing OTP codes
- DRY_RUN_SMS: "true"/"false" to enable dry-run (default true)

## Defaults (config.js)
- otpExpireMs: 5 minutes
- resendCooldownMs: 45 seconds
- maxVerifyAttempts: 5
- rateLimitWindowMs: 15 minutes
- rateLimitMaxRequests: 5

## Dry-run Override
- POST /admin/dry-run with {"enabled":true|false}
- Persists for process lifetime without restart.

## Files
- Config: [config.js](file:///c:/Users/Prais/projects/auth/server/src/config.js)
- Admin route: [admin.js](file:///c:/Users/Prais/projects/auth/server/src/routes/admin.js)
