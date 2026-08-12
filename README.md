# Brian Du — Portfolio

Personal portfolio site for product design, UX, design systems, and front-end work.

Built from the Claude Design handoff **Personal Brand: Four Directions**.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/amplify` | Amplify case study |
| `/seedwell` | Seedwell case study |
| `/resume` | Résumé |
| `/brand` | Brand guide (reference) |

## Local development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Re-import design handoff

If you export a new Claude Design zip:

```bash
unzip -o "/path/to/Personal Brand_ Four Directions.zip" -d /tmp/portfolio-handoff
npm run import:handoff
```

## Hero turntable frames

The home hero expects PNGs in `/frames`:

- `figure-28.png` … `figure-36.png`
- `figure-01.png` … `figure-10.png`

These were referenced in the design but not included in the zip. Until they are added, the hero shows the BD mark fallback.

## Deploy

- **GitHub**: push this repo
- **Vercel**: import the GitHub repo (static / Other framework). `vercel.json` enables clean URLs.
