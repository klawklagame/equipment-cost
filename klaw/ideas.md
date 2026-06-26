# Equipment Upgrade Cost — Ideas

Ideas for additions to the KLAWKLA Hero Equipment upgrade cost page (Common & Epic).

## What the page does now

A clean Thai-language static tool (`index.html` + `script.js` + `style.css`) for **Hero Equipment** upgrade costs:

| Section | Purpose |
|---|---|
| **Ore guide** | Shiny (1💎), Glowy (5💎), Starry (35💎) — when each is used |
| **Calculator** | Common L1–18 or Epic L1–27, pick from→to level, see ore + gem total |
| **Rate tables** | Per-level breakdown for both types, with key levels highlighted |

The data and UI are solid. The main gap is **planning beyond a single upgrade on one piece**.

---

## Ideas to add (by impact)

### High impact — players will use these often

**1. Quick preset buttons**
Add chips like `1→18 (Max คอมมอน)`, `1→27 (Max อีปิค)`, `9→12`, `15→18` so people don't type levels every time. Most visits are probably "how much to max this piece?"

**2. Multi-piece planner**
Input: "How many pieces?" (default 1). Output: multiply ore totals.
Example: max 4 common pieces = 4× shiny/glowy. Very common when planning a full hero loadout.

**3. Highlight selected range in the table**
When the calculator shows `5 → 15`, highlight those rows in the rate table. Makes the table feel connected to the calculator instead of a separate reference.

**4. Cumulative cost column**
Add a "รวมสะสม" column: total ore spent from L1 up to that level. Answers "I'm at L12 — how much have I already spent?" without mental math.

**5. Copy / share results**
- **Copy button** — paste into LINE/Discord: `คอมมอน L1→18: แร่วิบวับ 28,700 · แร่เรืองรอง 1,920 · 💎 38,300`
- **Share URL** — `?type=epic&from=1&to=27` so you can link from a YouTube description or klawkla post

**6. "I have this much ore" reverse calculator**
Inputs: shiny / glowy / starry in inventory → output: max level reachable (and what's missing for the next level). Helps during Ore Bank or after clan games.

---

### Medium impact — useful for your content & audience

**7. Common vs Epic comparison (L1–18)**
A small card: "Same 18 levels — Epic costs X more shiny, Y glowy, + Z starry = +N💎". Helps players decide whether epic gear is worth the premium.

**8. Milestone summary cards**
Static callouts at the top or in the calculator:

| Milestone | Common | Epic |
|---|---|---|
| L1→18 max | totals | — |
| L1→27 max | — | totals |
| L18→27 only (epic extension) | — | incremental cost |

**9. Equipment picker (visual)**
Grid of hero gear icons (BK AQ GW RC gear). Selecting one doesn't change math, but sets context: "Barbarian King's Giant Gauntlet L8→15". Good for video/screenshots and feels more like a game tool than a spreadsheet.

**10. Ore farming tips + link to your content**
Short section: where ores come from (events, challenges, Ore Bank). Link to your YouTube/Obsidian guides. Fits the klawkla "player helping players" brand.

**11. English toggle**
You already have clashbaselink.com for global audience. A language switch (or duplicate page) would widen reach with minimal new data — same `COMMON`/`EPIC` arrays, different labels.

---

### Nice polish — low effort, high feel

**12. Table row click → fill calculator**
Click L7 in the table → sets "from" to 6, "to" to 7 (or click-drag a range). Fast for "what does this one level cost?"

**13. Cost spike indicators**
Flag expensive jumps (e.g. L8→9, L17→18) with a small badge. Starry tiers at 9/12/15/18/21/24/27 are already highlighted — extend that in the calculator results: "⚠️ ข้าม L8→9 ใช้แร่เรืองรอง + แร่ประกายดาว".

**14. Last updated / patch note**
Footer line: "อัปเดตตามแพทช์ มิ.ย. 2026" — builds trust when Supercell tweaks costs.

**15. Related tools footer**
Links to other klawkla tools (base layouts, etc.) — keeps people on your ecosystem.

---

## What I'd build first (if you pick one direction)

**Phase 1** (quick wins): presets, multi-piece count, copy button, URL params

**Phase 2** (deeper planning): table range highlight, cumulative column, common vs epic compare

**Phase 3** (power user): reverse inventory calc, equipment picker, English version

---

## Ideas I'd skip for now

- **Real-money gem packs (THB/USD)** — useful but awkward; prices vary by region and store
- **Legendary equipment** — not in your data yet; add only when you have verified numbers
- **Blacksmith / forge costs** — different system; would dilute the page focus

---

## Recommended starting bundle

**Presets + multi-piece + share/copy** — all reuse existing `compute()` logic with almost no new data.

Possible directions:
- Planning tools (multi-piece, reverse calc)
- UX polish (presets, table sync)
- Audience expansion (English, equipment picker)
