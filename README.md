# Organ Donor Sign-up — Landing Page (SHARE OTSU)

A branded landing page that acts as a custom front door for the existing Google
**"Organ Donor Sign-up Form."** Every sign-up still lands in the **same linked
Google Sheet** — this page just submits to the form's hidden endpoint behind a
nicer design. No backend, no API keys, no build step.

## Files

| File | What it is |
|------|------------|
| `index.html` | The page content and the form |
| `styles.css` | The theme (misty glass + warm coral accent) |
| `script.js` | Validation + date handling + submit logic |
| `assets/logo.png` | **Drop your SHARE OTSU / SPMC logo here** |

## Add your logo

Save your logo as `assets/logo.png` (transparent PNG works best, about 72px
tall). The nav and footer pick it up automatically. Until then, a small heart
mark + the text "SHARE OTSU" shows instead.

## Preview it locally

From this folder:

```
python -m http.server 8130
```

Then open `http://localhost:8130/` in your browser.

## If the Google Form ever changes

If you add, remove, or rename a question in the Google Form, the hidden field
IDs (`entry.XXXXXXXXX`) can change and the page must be updated to match:

1. Open the live form's `…/viewform` page in your browser.
2. Right-click → **View Page Source**, then search (Ctrl+F) for
   `FB_PUBLIC_LOAD_DATA_`.
3. Find the new `entry.XXXXXXXXX` numbers for each question.
4. Update the matching `name="entry.XXX"` attributes in `index.html`
   (and the Birthday IDs / comments in `script.js`).
5. Submit one test entry and confirm it appears in the Sheet.

## Current field mapping

| Question | name (entry ID) |
|----------|-----------------|
| Full name | `entry.2005620554` |
| Birthday | `entry.1045781291` (posts as `_year` / `_month` / `_day`) |
| Sex | `entry.1065046570` |
| Address | `entry.1166974658` |
| Mobile number | `entry.1948858247` |
| Organs to donate | `entry.1369174641` |
| Email | `entry.1509176420` |
| Person who knows your decision | `entry.1746636546` |
| Their contact number | `entry.1669211873` |
| Conforme (consent) | `entry.669526485` |

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `organ-donor-signup`).
2. Put these files at the repo root.
3. Push:
   ```
   git init
   git add .
   git commit -m "Organ donor landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/organ-donor-signup.git
   git push -u origin main
   ```
4. On GitHub: **repo → Settings → Pages → Source = `main` branch, `/ (root)`** → Save.
5. After ~1 minute, your page is live at
   `https://<your-username>.github.io/organ-donor-signup/`.

## Before sharing the link

Submit one dummy entry (Full name = `ZZTEST`), confirm it shows up in the linked
Google Sheet, then **delete that test row**. After that, the page is ready to share.
