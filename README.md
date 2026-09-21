# Moodboard

A small, local web app for a daily mood check-in.

## Start the app

1. Open PowerShell in this folder.
2. Run `npm start`.
3. Open the `http://localhost:...` address shown in the terminal. (The app uses port 3000 when available, otherwise it tries the next port.)

No packages need to be installed. The app uses only Node.js and standard browser features.

## Project layout

- `server.js` starts the local web server.
- `public/index.html` contains the page structure.
- `public/styles.css` contains the visual design.
- `public/app.js` contains the live clock, daily mood storage, 30-day history, and trend chart.

## Your mood data

Moodboard stores one mood per local calendar day in your browser's local storage. Your latest choice for a day replaces an earlier choice for that same day. The dashboard shows the last 30 calendar days and a trend curve based on recorded moods. Data stays on this browser and is not sent anywhere.

Future enhancements can be added directly to this project without starting over.
