function normalizeZimbabwePhone(input) {
  if (!input || typeof input !== 'string') throw new Error('Invalid phone')
  let s = input.replace(/\s+/g, '')
  s = s.replace(/^00/, '+')
  s = s.replace(/^\+/, '')
  if (s.startsWith('263')) {
    s = s.slice(3)
  }
  if (s.startsWith('0')) {
    s = s.slice(1)
  }
  if (!/^\d+$/.test(s)) throw new Error('Invalid phone')
  if (!s.startsWith('7')) throw new Error('Must start with 7')
  const normalized = '263' + s
  if (normalized.length !== 12) throw new Error('Invalid length')
  return normalized
}

module.exports = { normalizeZimbabwePhone }
