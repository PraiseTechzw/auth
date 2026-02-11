const axios = require('axios')
const { config, isDryRun } = require('../config')

async function sendOtpSMS(phone, otp) {
  if (isDryRun()) {
    return { success: true, transport: 'dry_run', summary: { sent: 1 } }
  }
  if (!config.smsToken) {
    const e = new Error('SMS token missing')
    e.status = 500
    throw e
  }
  const body = {
    name: 'OTP Verification',
    message: 'Your verification code is: ' + otp,
    sender_id: config.smsSenderId,
    contact_import_method: 'manual',
    manual_contacts: phone
  }
  try {
    const res = await axios.post('https://smspop.co.zw/api/campaigns', body, {
      headers: {
        Authorization: 'Bearer ' + config.smsToken,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    const data = res.data
    if (data && data.success && data.summary && data.summary.sent > 0) {
      console.log('smspop success', { sent: data.summary.sent, contacts: data.contacts ? data.contacts.length : 0 })
      return { success: true, transport: 'smspop', summary: data.summary, contacts: data.contacts, raw: data }
    }
    const e = new Error('SMSPOP unexpected response')
    e.status = 502
    throw e
  } catch (err) {
    if (err.response) {
      const s = err.response.status
      const data = err.response.data
      console.log('smspop error status', { status: s, body: data })
      let code = 'sms_error_' + s
      if (s === 422 && data && typeof data.message === 'string') {
        if (/Invalid sender ID/i.test(data.message)) code = 'invalid_sender_id'
        if (/Validation failed/i.test(data.message)) code = 'validation_failed'
      }
      const e = new Error(code)
      e.status = s
      e.body = data
      throw e
    }
    console.log('smspop network error')
    const e = new Error('SMSPOP network error')
    e.status = 503
    throw e
  }
}

module.exports = { sendOtpSMS }
