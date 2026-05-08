# frontend-next

This is a Next.js frontend that consumes the notifications API at `http://4.224.186.213/evaluation-service/notifications`.

Run locally:

```bash
cd frontend-next
npm install
npm run dev
# open http://localhost:3000
```

Notes:
- Uses Material UI for styling.
- Stores viewed notification ids in `localStorage` to distinguish new vs viewed.
- Priority page is at `/priority` and allows selecting Top N and filtering by notification type.
- The app fetches notifications using the supported query params: `limit`, `page`, and `notification_type`.

Recording:
- Please record the running app pages (desktop + mobile emulation) using any screen recorder. The repo does not include the recording.
