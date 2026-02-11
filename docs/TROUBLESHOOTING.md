# Troubleshooting

## Common Errors
- 422 invalid_sender_id
  - Ensure SMSPOP_SENDER_ID matches an approved Sender ID.
- 422 validation_failed
  - Check request body and sender ID validity.
- 401 unauthorized
  - Verify SMSPOP_TOKEN is correct and active.
- 402 payment_required
  - Add credits on SMS POP.
- 403 forbidden
  - Account or content not permitted; contact provider support.
- 502 sms_bad_response
  - Unexpected provider response; retry and check provider status.
- 503 sms_network
  - Network issue; verify connectivity/timeouts.
- 429 cooldown or rate_limited
  - Respect cooldownMs and reduce request frequency.

## Device Connectivity (Development)
- Use Ngrok tunnels for mobile device testing against localhost.
- Ensure CORS_ORIGIN allows your frontend origin.

## Debugging
- Enable dry-run to avoid external provider calls:
  - POST /admin/dry-run {"enabled":true}
- Check server logs for mapped error codes.
