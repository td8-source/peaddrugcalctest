# Paeds doses

A single-page paediatric dose reference. There is no build step and no
dependencies: `index.html` is the whole app, `sw.js` caches it for offline use.
Open `index.html` in a browser to see a change.

> Uncontrolled copy. Not for operational use at this time. Nothing here has
> been cross referenced or validated against the source documents.

## Making a change

Everything clinical lives in one block near the top of the `<script>` in
`index.html`, between the banner comments marked `DATA` and `END OF DATA`.
Nothing below that marker knows the name of any drug, so a dose change, a new
drug, or a new version of a source document should never need an edit down
there. The block is in numbered sections:

| # | What | Change it to… |
|---|------|---------------|
| 1 | `META`, `TEXT` | update a source document version or the footer; reword a heading or a note |
| 2 | `BANDS`, `ADULT` | change a weight band, its label, or the age wording beside it |
| 3 | `PREPS` | add or reword a preparation (the recipes behind the numbered buttons) |
| 4 | `EAS` | the band dose tables — arrest, airway, drugs |
| 5 | `HEMS`, `CONSULT` | the per-kg HEMS extensions and the advice-only strip |
| 6 | `RSI` | the RSI per-kg doses |
| 7 | `VITALS` | vital signs by age |
| 8 | `FORMULAE` | the estimation formulae, and the cards that print them |

Each section has a comment above it explaining its shape. A few things worth
knowing before you start:

- **An EAS dose** is a row in `EAS.drugs` (or `.arrest` / `.airway`) with one
  line per weight band:

  ```js
  { name: "Ondansetron IV", bands: {
     5: null,
    10: ["2 mg", "1 ml (undiluted)", null],
    20: ["4 mg", "2 ml (undiluted)", null],
    ...
  }},
  ```

  The three columns are the bold dose, the small grey line beside it, and the
  preparation id. `null` for a whole band means the drug is not published at
  that weight and the row will say so.

- **Preparations are referred to by id, never by number.** The number on the
  button is just the entry's position in `PREPS`, so a new preparation can be
  dropped into the alphabetical order anywhere and everything renumbers itself.

- **Weight bands are defined once.** Editing `BANDS` moves the buttons at the
  top of the screen, the rounding, and the readout wording together.

## Checking a change

Open the page. If the data block has a problem the app can see — a preparation
id that does not exist, a weight band left out of a drug, a drug name used
twice — a red banner across the top lists it, and the same list goes to the
browser console.

**No banner only means the table is put together correctly. It says nothing
about whether the numbers are right.** Check those against the source document
yourself.

## Publishing a change

`sw.js` serves the cached copy first, so a phone that has already installed the
app will keep showing the old doses until the cache name changes. **Bump the
version in `const C` in `sw.js` every time you publish** — that is the only
thing that retires the old copy. Bump `META.lastUpdated` in `index.html` at the
same time so the footer shows when the content last moved.
