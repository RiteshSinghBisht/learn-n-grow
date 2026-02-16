# Learn N Grow

AI-powered English communication coaching web app with two chat assistants:

- `Fluent 24*7` for grammar guidance
- `Khushi` for conversational practice with voice support

## Features

- Email/password authentication with Firebase Auth
- Dashboard with learning stats and daily language content
- Dual chat experiences (grammar + conversation)
- Voice recording and playback in chat
- Webhook-based AI responses via n8n
- Feedback form webhook integration
- Profile management (name/photo/password)

## Tech Stack

- HTML, CSS, JavaScript (vanilla)
- Firebase (Auth, Firestore, Hosting)
- n8n webhooks for AI workflow orchestration
- Lucide icons + Chart.js

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── daily-data.js
├── firebase-config.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── assets (*.png)
```

## Local Development

Because this is a static frontend project, run it with a local HTTP server:

```bash
# Option 1: Python
python3 -m http.server 5500

# Option 2: Node
npx serve -l 5500 .
```

Open `http://localhost:5500`.

## Configuration

### 1. Firebase

Update `firebase-config.js` with your Firebase project credentials.

### 2. Webhooks

Webhook endpoints are defined in `app.js`:

- New user onboarding webhook
- Fluent bot webhook
- Khushi bot webhook
- Feedback webhook

Replace these with your own n8n endpoints for production.

## Deployment (Firebase Hosting)

```bash
firebase login
firebase use <your-project-id>
firebase deploy
```

`firebase.json` is already configured for SPA routing (all paths rewrite to `index.html`).

## Security Notes

- Review `firestore.rules` before production rollout.
- Ensure webhook URLs are production-safe and authenticated where needed.

## Contributing

1. Create a branch from `main`
2. Make your changes
3. Commit with a clear message
4. Open a pull request

## License

This project is licensed under the MIT License. See `LICENSE`.
