# OTP Verification App + Backend

A production-ready OTP verification system with:
- React Native (Expo) client in `app-expo`
- Node.js/Express backend in `server`
- SMS POP integration for delivering OTP codes
- Ngrok tunneling for device connectivity
- Dry-run testing mode with runtime toggle

## Prerequisites
- Node.js 20+ and npm
- Expo Go on your phone
- Ngrok with authtoken
- SMS POP account with an approved Sender ID and API token

## Quick Start
- Backend
  - Create `server/.env`:
    - PORT=3010
    - CORS_ORIGIN=*
    - SMSPOP_TOKEN=<your_token>
    - SMSPOP_SENDER_ID=<approved_sender_id> (e.g., SMSPoP)
    - OTP_PEPPER=<random_secret_string>
    - DRY_RUN_SMS=true|false
  - Install and run:
    - `cd server`
    - `npm install`
    - `npm start`
- Ngrok
  - `npx ngrok config add-authtoken <your_authtoken>`
  - `npx ngrok http 3010`
  - Copy the public URL (e.g., https://xxxx.ngrok-free.dev)
- App-Expo
  - `cd app-expo`
  - `npm install`
  - Update backend URL if needed: [config.json](file:///c:/Users/Prais/OneDrive/Desktop/auth/app-expo/src/config.json)
  - `npx expo start --tunnel`

## Configuration
- Environment variables: [config.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/config.js)
  - smsToken: SMSPOP_TOKEN
  - smsSenderId: SMSPOP_SENDER_ID
  - otpPepper: OTP_PEPPER
  - dryRunSms: DRY_RUN_SMS
  - resendCooldownMs, otpExpireMs, rate-limits
- Runtime testing toggle (no restart required)
  - POST `/admin/dry-run` with `{"enabled": true}` or `{"enabled": false}`
  - Implemented in [admin.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/routes/admin.js)

## API Reference
- GET `/health`
  - 200 `{ ok: true }`
- POST `/auth/request-otp`
  - Body: `{ phone: "0786xxxxxx" }`
  - Normalization (Zimbabwe): 0786… → 263786…
  - Success: `{ success: true, phone, expireMs, cooldownMs, delivery, debugOtp? }`
    - `delivery.transport`: `"smspop"` or `"dry_run"`
    - `debugOtp` present in dry-run for testing
  - Errors:
    - `rate_limited` 429
    - `cooldown` 429
    - `invalid_sender_id` 422
    - `validation_failed` 422
    - `unauthorized` 401
    - `insufficient_credit` 402
    - `forbidden` 403
    - `sms_network` 503
    - `sms_bad_response` 502
- POST `/auth/verify-otp`
  - Body: `{ phone: "0786xxxxxx", otp: "123456" }`
  - Success: `{ success: true }`
  - Errors:
    - `expired` 400
    - `attempts_exceeded` 429
    - `not_found` 404
    - `mismatch` 400

## Testing
- Testable app export: [app.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/app.js)
- Run tests:
  - `cd server`
  - `npm test`
- Tests: [auth.test.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/test/auth.test.js)
  - `/health` ok
  - `request-otp` (dry-run) returns `debugOtp`
  - `verify-otp` not_found when none requested

## Implementation Details
- Phone normalization: [phone.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/utils/phone.js)
- OTP generation + hashing: [otp.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/utils/otp.js)
- In-memory store with cooldown/rate-limits: [memoryStore.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/store/memoryStore.js)
- SMS send + error mapping: [sms.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/services/sms.js)
- Routes: [auth.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/routes/auth.js), [admin.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/server/src/routes/admin.js)
- App client and URL handling:
  - [client.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/app-expo/src/api/client.js)
  - Phone/OTP screens: [PhoneScreen.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/app-expo/src/screens/PhoneScreen.js), [OtpScreen.js](file:///c:/Users/Prais/OneDrive/Desktop/auth/app-expo/src/screens/OtpScreen.js)

## Deployment Notes
- Use a process manager (pm2/Systemd) to run the backend
- Set real domain and TLS; replace ngrok when stable
- Secure environment variables; never commit tokens
- Monitor logs and add rate-limit shields at the proxy if needed

## Troubleshooting
- Sender ID rejected (422 invalid_sender_id)
  - Ensure exact approved Sender ID and correct API token/account
- Unauthorized (401)
  - Check SMSPOP_TOKEN validity
- Insufficient credit (402)
  - Add credits in SMS POP dashboard
- Account inactive or content rejected (403)
  - Contact support; adjust message content
- Network issues (503) or bad response (502)
  - Retry; check provider status; confirm timeouts
- Cooldown / rate_limited
  - Wait for countdown; respected by in-memory store
- Expo device connectivity
  - Use tunnel, or set the backend URL in app-expo [config.json](file:///c:/Users/Prais/OneDrive/Desktop/auth/app-expo/src/config.json)

## License
- Private project; adapt as needed for your organization.
