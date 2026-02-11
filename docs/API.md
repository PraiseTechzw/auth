# API Documentation

## Base URL
- Default: http://localhost:3010
- Configurable via PORT in server/.env

## Health
- GET /health
- Response: 200 { "ok": true }

## Request OTP
- POST /auth/request-otp
- Body:
```json
{ "phone": "0786123456" }
```
- Phone normalization (Zimbabwe): 0786… → 263786…
- Success response:
```json
{
  "success": true,
  "phone": "263786123456",
  "expireMs": 300000,
  "cooldownMs": 45000,
  "delivery": { "transport": "dry_run", "summary": { "sent": 1 } },
  "debugOtp": "123456"
}
```
- Error responses:
  - 429 { "success": false, "error": "rate_limited" }
  - 429 { "success": false, "error": "cooldown", "cooldownMs": 45000, "remainingMs": 12345 }
  - 401 { "success": false, "error": "unauthorized" }
  - 402 { "success": false, "error": "payment_required" }
  - 403 { "success": false, "error": "forbidden" }
  - 422 { "success": false, "error": "invalid_sender_id" | "validation_failed" }
  - 500 { "success": false, "error": "server_misconfig" }
  - 502 { "success": false, "error": "sms_bad_response" }
  - 503 { "success": false, "error": "sms_network" }

### Curl Example
```bash
curl -X POST $BASE/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"0786123456"}'
```

## Verify OTP
- POST /auth/verify-otp
- Body:
```json
{ "phone": "0786123456", "otp": "123456" }
```
- Success: 200 { "success": true }
- Errors:
  - 400 { "success": false, "error": "expired" }
  - 429 { "success": false, "error": "attempts_exceeded" }
  - 404 { "success": false, "error": "not_found" }
  - 400 { "success": false, "error": "mismatch", "remaining": 3 }

### Curl Example
```bash
curl -X POST $BASE/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"0786123456","otp":"123456"}'
```

## Admin: Dry Run Toggle
- POST /admin/dry-run
- Body:
```json
{ "enabled": true }
```
- Success: 200 { "success": true, "dryRun": true }

## Files
- App: [app.js](file:///c:/Users/Prais/projects/auth/server/src/app.js)
- Auth routes: [auth.js](file:///c:/Users/Prais/projects/auth/server/src/routes/auth.js)
- Admin routes: [admin.js](file:///c:/Users/Prais/projects/auth/server/src/routes/admin.js)
- SMS service: [sms.js](file:///c:/Users/Prais/projects/auth/server/src/services/sms.js)
- Config: [config.js](file:///c:/Users/Prais/projects/auth/server/src/config.js)
