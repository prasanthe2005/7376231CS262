// utility to compute top N priority notifications
const WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
}

export function scoreNotification(n) {
  const weight = WEIGHT[n.Type] || 0
  const ts = new Date(n.Timestamp || n.timestamp || '').getTime() || 0
  // Give weight a large multiplier so it dominates, then add recency
  return weight * 1e13 + ts
}

export function getTopNotifications(notifications = [], n = 10) {
  return [...notifications]
    .map((it) => ({ ...it, _score: scoreNotification(it) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n)
}

export default getTopNotifications
