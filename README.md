# Kush Chaurasiya — Video Editor Portfolio

A single-page portfolio with smooth scrolling, scroll-driven 3D scenes and a viewfinder cursor.
Plain HTML/CSS/JS: no build step needed.

## Run it locally

```bash
python3 serve.py
```

Then open http://localhost:5173

`serve.py` turns off browser caching, so a reload always shows your latest edits.
Don't open `index.html` by double-clicking it: YouTube refuses to play videos on pages opened
straight from disk ("Error 153"). The site falls back to opening the video on YouTube in that case.

## Page order

Hero → quote + photo → About → Services → Work (3D reel) → FAQ → Contact

## Make it yours (all in `js/main.js`, at the top)

- **`CONFIG.email`**: your email (currently `kushchorasiya@gmail.com`).
- **`CONFIG.socials`**: your social links. Instagram and YouTube are set; LinkedIn and Behance still point to the sites' home pages.
- **`CONFIG.showreel`**: a YouTube, Vimeo or `.mp4` link for the **▶ SHOWREEL** tab.
- **`WORKS`**: your projects in the 3D reel (currently 9). For each one, set:
  - `title`: the name on the card, `full`: the name shown in the video player, `tag`: the category
  - `url`: a YouTube link (plays inside the site, thumbnail is pulled automatically) or an Instagram link (opens in a new tab)
  - `img`: a cover image, only needed for Instagram projects (drop it into `assets/shots/`)
- **FAQ answers**: in `index.html`, section `id="faq"` (4 questions).

## Photos

| Where | File |
|---|---|
| Hero cut-out | `assets/kush-hero.png` |
| Quote section photo | `assets/kush-cinema.jpg` |
| About print | `assets/kush-about.jpg` |
| "Addiction" card cover | `assets/shots/b2-green.jpg` |
| Footer cut-out | `assets/kush-footer.png` |

To swap a photo, replace the file and keep its name.

`_unused-photos/` holds 15 graded photos that the site no longer uses (they were for the removed
"How I cut" section). They're kept in case you want them back.

## Files

- `index.html`: page structure and copy
- `css/style.css`: all styling (colours are at the top under `:root`)
- `js/main.js`: loader, cursor, smooth scroll, 3D reel, marble shader
- `assets/`: the photos the site uses
- `assets/_source/`: your original photos and raw cut-outs (not needed online)
- `serve.py`: local preview server

## Deploy

Upload the folder to Netlify Drop, Vercel, GitHub Pages or any static host. You can leave out
`assets/_source/` and `_unused-photos/` to keep the upload small.
