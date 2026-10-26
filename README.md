# BREACH PROTOCOL: The Genesis Chip Leak
Multiplayer investigation game. Node/Express, vanilla JS, SSE, JSON-file persistence (single server only).
## Run
    npm install && ADMIN_PASSWORD=your-secret npm start     # players: /   organizer: /admin.html
    npm test
    docker compose up --build   (copy .env.example to .env first)
## Organizer
Sign in at `/admin.html`; Start, Pause, Resume, End, Reset (confirm), set duration, hints (10/20/30 min default) and leaderboard. Runtime state: `data/runtime/state.json`; delete it or use Reset to start over.
## Mechanics
Six simulated apps (domains in the address bar): TeamPLAY, IPLogger, Grammie, NexMail, Atlas, 10Plan. Find the culprit, deduce their Grammie password (PassTrace: the `>_` button on a profile picture, `proximity <guess>`), log in, open the private 10Plan chat. The server grants the win atomically on that open; there is no accusation form.
## Security
Sessions are HttpOnly SameSite=Strict cookies, state-changing requests need `X-Requested-With`, CSP/headers set, request size limits, rate limits on login/PassTrace/admin. Solution data (passwords, chats) stays in `data/seed.js` on the server. Set `COOKIE_SECURE=1` behind HTTPS.
## Limits
State is process-local plus JSON file: do not horizontally scale. Seed data is in `data/seed.js` (edit to extend the story).
