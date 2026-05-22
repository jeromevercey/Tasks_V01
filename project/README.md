# Tasks & Schedules — Prototype

Interactive prototype for the **Add / Edit Schedule** flow: a 3-step wizard
(Schedule info → Notifications → Launch conditions) with per-tab overview
in edit mode.

## Run locally

It's a static page — no build step. Just open `index.html` in a browser, or
serve the folder:

```bash
npx serve .
```

## Live deploy (Vercel)

This repo is wired to deploy automatically on every push to `main`.

- Production: every commit to `main` triggers a deploy.
- Preview: every other branch / pull-request gets its own preview URL.

Vercel auto-detects this as a static site — no build command needed. The
root `index.html` is what gets served.

## Files

| File | Purpose |
|---|---|
| `index.html` | Entry point (loaded by Vercel at `/`) |
| `Notifications Prototype.html` | Same content, original filename |
| `prototype.jsx` | Main app — `MainPage`, tabs, schedule + notif + launch-conditions config |
| `notifications.jsx` | Earlier exploration: slide-over notification panels |
| `design-canvas.jsx` | Canvas wrapper (used by the older exploration file) |
| `Notifications.html` | Earlier exploration entry |

## Stack

- React 18 (UMD) + Babel standalone — no bundler
- Inter font via Google Fonts
- Plain inline styles — no CSS framework
