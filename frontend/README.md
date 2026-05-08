Campus Notifications - Frontend (Stage 1)

This folder contains the Stage 1 frontend and helper scripts for the Priority Inbox evaluation.

Contents
- `src/` - React app (All + Priority pages)
- `src/utils/priority.js` - scoring and `getTopNotifications`
- `src/utils/logger.js` - reusable `Log()` (best-effort POST)
- `scripts/top10.js` - Node script to fetch notifications and write `top10.json` (requires token)
- `scripts/auth_top10.js` - helper that can obtain a token from the auth endpoint (if env vars provided) and write `top10.json`
- `Notification_System_Design.md` - Stage 1 design writeup

Quick setup
1. Install deps
```powershell
cd frontend
npm install
```

Run and verify (Node script)
- If you already have a bearer token (bash):
```bash
BEARER_TOKEN='eyJ...' npm run top10
```
- On PowerShell set the env var then run:
```powershell
$env:BEARER_TOKEN = 'eyJ...'
npm run top10
```
- Or use the combined auth+fetch helper (provide auth env vars or `BEARER_TOKEN`):
```powershell
# either set BEARER_TOKEN, or set these env vars:
# EMAIL, NAME, ROLLNO, ACCESSCODE, CLIENTID, CLIENTSECRET
npm run auth-top10
```

Outputs
- `top10.json` — Top 10 notifications (written by the scripts). Use this as evidence / screenshots.

Run the frontend UI
```powershell
npm run dev
# open http://localhost:3000
```
- Paste your Bearer token in the `API Token` field at the top of the All or Priority page and click `Save Token`.
- The app will re-fetch and display notifications. No database is used; all computation is in-memory.

Screenshot checklist (required for submission)
- Desktop Priority Inbox page with Top N visible (include browser URL bar if possible).
- Mobile Priority Inbox page (use browser device toolbar to emulate mobile) showing top notifications.
- Screenshot of `top10.json` contents (or console output) demonstrating top 10 order.

What to push to GitHub
- The entire `frontend/` folder including `scripts/`, `src/`, and `Notification_System_Design.md`.
- Do NOT include any secret tokens in the repo.

If you'd like, I can run `npm run auth-top10` here if you provide the token or auth env values (I will not store them), and paste the `top10.json` output for you to include in the repo.
