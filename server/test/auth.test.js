const request = require('supertest')
let app

describe('API', () => {
  beforeAll(() => {
    process.env.DRY_RUN_SMS = 'true'
    jest.resetModules()
    app = require('../src/app').app
  })
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  test('POST /auth/request-otp dry-run returns debugOtp', async () => {
    const res = await request(app).post('/auth/request-otp').send({ phone: '0786123456' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.phone).toMatch(/^26378\d{7}$/)
    expect(res.body.delivery && res.body.delivery.transport).toBe('dry_run')
    expect(typeof res.body.debugOtp).toBe('string')
    expect(res.body.debugOtp.length).toBe(6)
  })

  test('POST /auth/verify-otp not_found when none requested', async () => {
    const res = await request(app).post('/auth/verify-otp').send({ phone: '0786999999', otp: '000000' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('not_found')
  })
})
