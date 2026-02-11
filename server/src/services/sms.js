const axios = require('axios')
const { config } = require('../config')

async function sendOtpSMS(phone, otp) {
  if (config.dryRunSms) {
    return { success: true, summary: { sent: 1 } }
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
      console.log('smspop success', { sent: data.summary.sent })
      return data
    }
    const e = new Error('SMSPOP unexpected response')
    e.status = 502
    throw e
  } catch (err) {
    if (err.response) {
      const s = err.response.status
      console.log('smspop error status', { status: s })
      const e = new Error('SMSPOP error ' + s)
      e.status = s
      throw e
    }
    console.log('smspop network error')
    const e = new Error('SMSPOP network error')
    e.status = 503
    throw e
  }
}

module.exports = { sendOtpSMS }
