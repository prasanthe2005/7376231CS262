# Stage 1 - Notification System Design

## Approach

- Priority is computed using a combination of type weight and recency. Type weights: Placement=3, Result=2, Event=1.
- Each notification is scored as: score = weight * 1e13 + timestamp(ms). Weight dominates, recency breaks ties.
- To get top N, sort by score descending and take first N. For streaming updates, maintain a size-N min-heap keyed by score to update top N in O(log N) per new notification.

## Files added

- `frontend/src/utils/priority.js` - scoring and getTopNotifications utility.
- `frontend/src/utils/logger.js` - reusable `Log(stack, level, package, message)` function (best-effort POST to test server and console log).
- React UI under `frontend/src/pages` and `frontend/src/components`.

## Maintaining top 10 efficiently

- For high-throughput streams, use a min-heap of size N. When a new notification arrives, calculate its score; if heap size < N push; else compare with heap root and replace if larger. Complexity: O(log N) per notification and O(N) memory.

## How to run

1. Open a terminal in `frontend`.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev` (app serves on default Vite port; set to run on http://localhost:3000 if required by adjusting the dev server port).

## Notes

- The frontend stores read/unread state in `localStorage` under `readIds`.
- Material UI is used for styling.
- The `Log` function is best-effort and will not block UI on network errors.
