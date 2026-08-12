# Brian Du — logo assets

Soft Technical identity, treatment 2b. Geometry: cap height 96 = 2R (R = 48, the D's outer
radius); the B's bowls are R/2; stem, bars and D wall are all 15 units.

| File | Use |
| --- | --- |
| bd-mark-primary.svg | Primary mark. Charcoal letterform, periwinkle D counter, transparent negative space. |
| bd-mark-mono-charcoal.svg | One colour #171A22. Documents, resumes, anything printed. |
| bd-mark-mono-black.svg | Pure black. Stamps, faxes, single-ink print. |
| bd-mark-reversed.svg | For dark backgrounds. #EDF0F6 letterform, #A9B2D8 counter. |
| bd-mark-reversed-mono.svg | White, one colour. |
| bd-avatar-circle-dark.svg | 200×200 circle crop. LinkedIn, GitHub, Slack. |
| bd-avatar-tile-periwinkle.svg | 200×200 squircle, periwinkle field. Alternate avatar. |
| bd-favicon-32.svg | 32px. Two-tone dropped, counters at full weight. |
| bd-favicon-16.svg | 16px. Counters thickened to 15 units so they survive. |
| bd-linkedin-banner.svg | 1584×396. Mark and name left of centre, clear of the profile photo. |

## Notes

- The marks use an SVG `mask` so the counters and the D crescent are genuinely transparent —
  they sit on any background. Figma imports masks; if you want editable paths instead, redraw
  from the construction: two circles (R and R/2) on one vertical axis.
- Clear space: 15 units (one stem width) on all four sides, measured from the 88 × 96 box.
- Minimum size: 20px tall for the two-tone version, 16px for one colour.
- The banner's text is live `<text>` in Montserrat. Convert to outlines in Figma before handing
  the file anywhere the font isn't installed.
- Wordmark files are not included: Montserrat is a Google font, so set "BRIAN DU" in
  Montserrat Light at +0.16em tracking and outline it yourself rather than shipping a
  pre-outlined copy.
