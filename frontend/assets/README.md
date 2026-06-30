# Adding your own images — no code changes needed

Drop files into this folder (`frontend/assets/`) using these **exact names**,
and they'll appear on the site automatically. If a file isn't there yet, that
spot just shows an empty tile at the same size — nothing breaks — so you can
add these gradually, in any order.

| Filename                  | Where it appears                          | Suggested size      |
|----------------------------|--------------------------------------------|----------------------|
| `logo.png`                 | Header, every page                         | Square, ~200×200px, transparent background |
| `hero.jpg`                  | Homepage, right side of the hero            | ~1000×800px, landscape |
| `gallery-1.jpg` … `gallery-8.jpg`  | Homepage "Real work" section, top row (scrolls left)    | ~960×720px each |
| `gallery-9.jpg` … `gallery-16.jpg` | Homepage "Real work" section, bottom row (scrolls right) | ~960×720px each |

That's 16 photos total for the moving gallery — 8 per row. They auto-loop
continuously in opposite directions, and pause if someone hovers over them.

## How to add one
1. Rename your photo to match the table above exactly (e.g. `gallery-3.jpg`).
2. Drop it into this `assets/` folder, replacing nothing else.
3. Re-deploy (or just refresh, if testing locally) — it shows up automatically.

## Tips
- JPG or PNG both work. Keep file sizes reasonable (under ~300KB each, since
  there are 16 of them) so the homepage still loads quickly on mobile data.
- Real photos of actual registered providers doing real jobs (with their
  permission) build far more trust than stock photos — see the "what image
  should I use" guidance Claude gave earlier in this conversation for what
  makes a good shot.
- You don't need all 16 at once. Even 4–5 real photos repeated will look
  better than empty tiles — just duplicate filenames temporarily if needed
  (e.g. copy the same file to `gallery-1.jpg` through `gallery-4.jpg`) until
  you have more.
- Each tile crops to a fixed box (object-fit: cover), so landscape photos
  with the subject centered work best — avoid important details near the
  edges of the frame.
