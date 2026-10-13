# A Little Universe Made Just for You

A cinematic birthday surprise website — Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Framer Motion, Lucide.

It runs as a Next.js app, ready to deploy on Vercel.

## Run it

```bash
npm install
cp .env.example .env   # then set PASSWORD in .env
npm run dev            # http://localhost:3000
npm run build
npm start              # production server
```

## Personalize (no component code needed)

Everything lives in **`src/config/birthday.ts`**:

| What | Field |
| --- | --- |
| Her name / your name | `herName`, `yourName` |
| Birthday (shows date + countdown only if set) | `birthdayDate: "2026-11-02"` |
| Password she must type first | `PASSWORD` in `.env` |
| Opening screen text | `opening` |
| Hero headline, subtitle, caption, photo | `hero` |
| Message paragraphs (wrap words in `*asterisks*` to make them glow gold) and handwritten notes | `message` |
| Gallery (12–25 photos) | `gallery.photos` |
| Videos (3–5 clips) | `videos.items` |
| Cake text, number of candles | `cake` |
| Finale message | `finale` |
| Music | `music` |
| Page title / share description / share image | `meta` |

Search the file for `[HER NAME]`, `[YOUR NAME]`, `[ADD YOUR PHOTO]`, `[ADD YOUR VIDEO]` and the bracketed notes — replace each with your own words.

### Photos
1. Copy images into `public/images/` (JPG/WebP, ~1600px on the long edge is plenty).
2. Set `src: "/images/your-file.jpg"`, plus `alt`, `caption`, `date`.
3. `orientation` (`portrait` | `landscape` | `square`) controls the frame shape; `style` (`polaroid` | `editorial`) the look; `rotate` adds a small tilt.

Any entry with an empty `src` shows an elegant placeholder; a missing file falls back to the placeholder too.

### Videos
Put short MP4 (H.264) clips in `public/videos/`, set `src: "/videos/clip.mp4"` and optionally a `poster: "/images/clip-poster.jpg"`. Keep clips small (under ~10 MB) for phones. Muted previews auto-loop only on capable devices and never with reduced motion.

### Music
With `music.src` empty, the site plays a soft, generated music-box melody (no file, no licensing issues). To use your own song, add a track **you have the rights to** (e.g. a royalty-free or self-recorded piece) to `public/audio/` and set `music.src: "/audio/our-song.mp3"`. Music only starts after she unlocks the surprise (set `startOnOpen: false` to require the toggle), and the floating toggle remembers her choice for the session.

### Share preview image
Add a 1200×630 `public/og.jpg` and set `meta.ogImage: "/og.jpg"`.

## Deploy

**Vercel:** import the GitHub repo, or run `npx vercel`. In the project settings, add an environment variable named `PASSWORD` for Production and Preview (the same value as in `.env`). The lock screen checks that value on the server, so it is not shipped in the page.

Framework preset is Next.js. Build command `npm run build`, output handled by Vercel. No `output: "export"` and no extra `vercel.json` are required.

## Password

The site opens on a lock screen. Set `PASSWORD` in `.env` locally and in the Vercel project. Capitals and extra spaces are ignored. Tell her the word yourself — it is not shown on the page. Once she gets it right, the browser remembers it for that visit, so replaying the surprise doesn't ask again.

## Notes
- Respects `prefers-reduced-motion`: ambient particles freeze, confetti/fireworks are skipped, content is all still shown.
- Lower particle counts on phones / low-power devices; canvases pause when offscreen.
- The microphone is only requested when she taps "Or blow into your microphone" (HTTPS only); the button always works.
- Keyboard: Esc closes a photo or video, arrow keys move through them. The opening plays through; Begin continues into the site.
