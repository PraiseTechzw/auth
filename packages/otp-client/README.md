# @otp/otp-client

Universal OTP client usable in React, Expo, Web, and Node.

## Install (Private)
- Monorepo workspace usage (recommended):
  - Add `"@otp/otp-client": "workspace:*"` to your app's package.json
- Git URL (private repo access required):
  - `npm install git+ssh://github.com/PraiseTechzw/auth.git#main --workspace=packages/otp-client`
  - Then depend on it via `file:` or workspace reference

## Configure
- Option A: Programmatic
  - `setBaseUrl('https://your-backend.ngrok-free.dev')`
- Option B: Environment (Node/Web)
  - `OTP_BASE_URL=https://your-backend.ngrok-free.dev`
- Optional: Persist base URL
  - `attachStorage(AsyncStorage)` in React Native / Expo

## Usage
```js
import { setBaseUrl, requestOtp, verifyOtp, health } from '@otp/otp-client'
setBaseUrl('https://your-backend.ngrok-free.dev')
await health()
const req = await requestOtp('0786123456')
const ok = await verifyOtp('0786123456', '123456')
```

### React / Expo
```js
import { attachStorage, setBaseUrl, requestOtp, verifyOtp } from '@otp/otp-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
attachStorage(AsyncStorage)
setBaseUrl('https://your-backend.ngrok-free.dev')
```

### Node
```js
const { requestOtp, verifyOtp } = require('@otp/otp-client')
process.env.OTP_BASE_URL = 'https://your-backend.ngrok-free.dev'
```

## API
- `setBaseUrl(url)` sets backend base URL
- `getBaseUrl()` retrieves current base URL
- `attachStorage(storage)` optional storage with `getItem`/`setItem`
- `health()` → `{ ok: true }`
- `requestOtp(phone)` → `{ success, phone, delivery, debugOtp? }`
- `verifyOtp(phone, otp)` → `{ success } | { success:false, error }`

## Notes
- Uses native `fetch` (Node 18+ and browsers/React Native)
- Includes 10s timeout via `AbortController`
- No dependencies; tree-shakeable

## Publish
- This package is private; npm publishing is disabled.
- Use workspace or git URL installation methods above.
