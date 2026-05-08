// lightweight frontend logging utility
// exposes Log(stack, level, packageName, message)
export async function Log(stack = '', level = 'INFO', packageName = '', message = '') {
  const payload = { stack, level, package: packageName, message, ts: new Date().toISOString() }
  // send to remote test server logging endpoint if available
  try {
    await fetch('http://4.224.186.213/evaluation-service/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    // best-effort; don't block app - still print locally
    // eslint-disable-next-line no-console
    console.warn('Log: remote send failed', e)
  }
  // eslint-disable-next-line no-console
  console.log('Log:', payload)
}

export default Log
