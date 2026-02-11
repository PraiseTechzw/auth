# @traisetech/otp-client

Universal OTP client for React, Expo, Web, and Node. Provides a simple, reliable way to request and verify One-Time Passwords against a standardized backend API. Designed to integrate smoothly with JHS projects and frontends.

## Why Use This
- Solves OTP flows end-to-end without custom fetch glue.
- Normalizes phone handling and enforces timeouts to avoid hanging requests.
- Works identically across web, Node, and React Native/Expo.

## Install
- `npm install @traisetech/otp-client`

## Quick Start
```js
import { setBaseUrl, health, requestOtp, verifyOtp } from '@traisetech/otp-client'

setBaseUrl('https://your-backend.example') // or set OTP_BASE_URL env
await health() // { ok: true }
const req = await requestOtp('0786123456') // returns expireMs, cooldownMs, delivery
const ok = await verifyOtp('0786123456', '123456') // { success: true } or error
```

## JHS Integration
- Backend URL management:
  - Web/Node: set `process.env.OTP_BASE_URL` at build/runtime
  - React Native/Expo: call `setBaseUrl()` at app init
- Persist configuration on device:
  - `attachStorage(AsyncStorage)` to remember base URL across launches
- UI flow:
  - Phone screen → call `requestOtp(phone)` → show countdown using `cooldownMs`
  - OTP screen → call `verifyOtp(phone, otp)` → handle error codes for retries
- Error handling:
  - Map returned `error` to user messages (e.g., `cooldown`, `rate_limited`, `mismatch`, `expired`)

## Configuration
- Programmatic:
  - `setBaseUrl(url: string)` sets request base URL.
  - `attachStorage(storage)` persists internal base URL (requires `{ getItem, setItem }`).
- Environment (Web/Node):
  - `OTP_BASE_URL=https://your-backend.example`
- Fetch options:
  - Optional `{ timeoutMs?: number }` per call to override default timeout.

## Zimbabwe SMS POP Backend Setup
- Goal: Enable OTP SMS delivery for Zimbabwe numbers using SMS POP.
- Prerequisites:
  - SMS POP account with an approved Sender ID and API token
  - Backend deployed or running locally
- Environment variables (server/.env):
```
PORT=3010
CORS_ORIGIN=*
SMSPOP_TOKEN=<your_sms_pop_api_token>
SMSPOP_SENDER_ID=<approved_sender_id>    # e.g., SMSPoP
OTP_PEPPER=<random_secret_string>        # used for hashing OTP
DRY_RUN_SMS=false                        # set true for local testing without SMS
```
- Start backend:
  - `cd server && npm install && npm start`
- Phone normalization rules (Zimbabwe):
  - Input like `0786123456` becomes `263786123456`
  - Only mobile numbers starting with `7` are accepted; numeric only
- Local testing:
  - Set `DRY_RUN_SMS=true` and use `debugOtp` returned by `/auth/request-otp`
  - Toggle at runtime: `POST /admin/dry-run {"enabled": true}`

## API Reference
- `setBaseUrl(url: string): void`
  - Sets the base URL used for requests.
- `getBaseUrl(): Promise<string>`
  - Returns the effective base URL (storage/env/programmatic).
- `attachStorage(storage: { getItem, setItem }): void`
  - Attaches persistent storage for base URL in RN/Expo.
- `health(opts?): Promise<{ ok: true }>`
  - GET `/health`
- `requestOtp(phone: string, opts?): Promise<{ success?: boolean, phone?: string, expireMs?: number, cooldownMs?: number, delivery?: any, debugOtp?: string }>`
  - POST `/auth/request-otp` with `{ phone }`
  - `debugOtp` only present if backend dry-run is enabled.
- `verifyOtp(phone: string, otp: string, opts?): Promise<{ success?: boolean, error?: string, remaining?: number }>`
  - POST `/auth/verify-otp` with `{ phone, otp }`

## Usage Examples
### React Native / Expo
```js
import { attachStorage, setBaseUrl, requestOtp, verifyOtp } from '@traisetech/otp-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

attachStorage(AsyncStorage)
setBaseUrl('https://your-backend.example')

export async function onRequest(phone) {
  const r = await requestOtp(phone)
  if (!r.success) throw new Error(r.error || 'request_failed')
  return r
}

export async function onVerify(phone, otp) {
  const r = await verifyOtp(phone, otp)
  if (!r.success) throw new Error(r.error || 'verify_failed')
  return r
}
```

### Web / Node with Environment
```js
process.env.OTP_BASE_URL = 'https://your-backend.example'
const { requestOtp, verifyOtp } = require('@traisetech/otp-client')

async function flow() {
  await requestOtp('0786123456')
  await verifyOtp('0786123456', '123456')
}
```

### Advanced: Custom Timeout & Storage
```js
import { attachStorage, setBaseUrl, requestOtp } from '@traisetech/otp-client'

attachStorage({
  async getItem(k) { return localStorage.getItem(k) || undefined },
  async setItem(k, v) { localStorage.setItem(k, v) }
})

setBaseUrl('https://your-backend.example')
await requestOtp('0786123456', { timeoutMs: 15000 })
```

## Best Practices
- Always set a stable base URL at app startup.
- Surface cooldown and expiry timers to users for a better UX.
- Do not log OTP values; use backend dry-run for debug only.
- Handle error codes explicitly and guide users to retry or wait.

## Troubleshooting
- `rate_limited` / `cooldown`
  - Wait for the countdown; avoid repeated requests.
- `invalid_sender_id` / `unauthorized`
  - Backend environment variables misconfigured; fix server-side.
- `mismatch`
  - Wrong OTP; display remaining attempts and allow retry.
- `expired`
  - OTP timed out; re-request a new OTP.
- Network timeouts
  - Increase `timeoutMs` or check backend connectivity.

## Notes
- Uses native `fetch` (Node 18+ and modern browsers/React Native).
- Includes timeout via AbortController; configurable per request.
- Zero runtime dependencies; tree-shakeable for web builds.

## Security
- Never store or log OTP values on the client.
- Prefer HTTPS and secure environments for OTP flows.

## License
- MIT
