// ==============================================================
// Equipment Upgrade Cost · KLAWKLA
// Data: per-level cost to UPGRADE TO that level
// ==============================================================

const COMMON = [
    { lv: 1,  shiny: 0,    glowy: 0,   starry: 0 },
    { lv: 2,  shiny: 120,  glowy: 0,   starry: 0 },
    { lv: 3,  shiny: 240,  glowy: 20,  starry: 0 },
    { lv: 4,  shiny: 400,  glowy: 0,   starry: 0 },
    { lv: 5,  shiny: 600,  glowy: 0,   starry: 0 },
    { lv: 6,  shiny: 840,  glowy: 100, starry: 0 },
    { lv: 7,  shiny: 1120, glowy: 0,   starry: 0 },
    { lv: 8,  shiny: 1440, glowy: 0,   starry: 0 },
    { lv: 9,  shiny: 1800, glowy: 200, starry: 0 },
    { lv: 10, shiny: 1900, glowy: 0,   starry: 0 },
    { lv: 11, shiny: 2000, glowy: 0,   starry: 0 },
    { lv: 12, shiny: 2100, glowy: 400, starry: 0 },
    { lv: 13, shiny: 2200, glowy: 0,   starry: 0 },
    { lv: 14, shiny: 2300, glowy: 0,   starry: 0 },
    { lv: 15, shiny: 2400, glowy: 600, starry: 0 },
    { lv: 16, shiny: 2500, glowy: 0,   starry: 0 },
    { lv: 17, shiny: 2600, glowy: 0,   starry: 0 },
    { lv: 18, shiny: 2700, glowy: 600, starry: 0 },
];

const EPIC = [
    { lv: 1,  shiny: 0,    glowy: 0,   starry: 0 },
    { lv: 2,  shiny: 120,  glowy: 0,   starry: 0 },
    { lv: 3,  shiny: 240,  glowy: 20,  starry: 0 },
    { lv: 4,  shiny: 400,  glowy: 0,   starry: 0 },
    { lv: 5,  shiny: 600,  glowy: 0,   starry: 0 },
    { lv: 6,  shiny: 840,  glowy: 100, starry: 0 },
    { lv: 7,  shiny: 1120, glowy: 0,   starry: 0 },
    { lv: 8,  shiny: 1440, glowy: 0,   starry: 0 },
    { lv: 9,  shiny: 1800, glowy: 200, starry: 10 },
    { lv: 10, shiny: 1900, glowy: 0,   starry: 0 },
    { lv: 11, shiny: 2000, glowy: 0,   starry: 0 },
    { lv: 12, shiny: 2100, glowy: 400, starry: 20 },
    { lv: 13, shiny: 2200, glowy: 0,   starry: 0 },
    { lv: 14, shiny: 2300, glowy: 0,   starry: 0 },
    { lv: 15, shiny: 2400, glowy: 600, starry: 30 },
    { lv: 16, shiny: 2500, glowy: 0,   starry: 0 },
    { lv: 17, shiny: 2600, glowy: 0,   starry: 0 },
    { lv: 18, shiny: 2700, glowy: 600, starry: 50 },
    { lv: 19, shiny: 2800, glowy: 0,   starry: 0 },
    { lv: 20, shiny: 2900, glowy: 0,   starry: 0 },
    { lv: 21, shiny: 3000, glowy: 600, starry: 100 },
    { lv: 22, shiny: 3100, glowy: 0,   starry: 0 },
    { lv: 23, shiny: 3200, glowy: 0,   starry: 0 },
    { lv: 24, shiny: 3300, glowy: 600, starry: 120 },
    { lv: 25, shiny: 3400, glowy: 0,   starry: 0 },
    { lv: 26, shiny: 3500, glowy: 0,   starry: 0 },
    { lv: 27, shiny: 3600, glowy: 600, starry: 150 },
];

const GEM_PRICE = { shiny: 1, glowy: 5, starry: 35 };
const ORE_ICONS = {
    shiny: 'https://klawkla.com/content/images/2026/06/shiny-ore.webp',
    glowy: 'https://klawkla.com/content/images/2026/06/glowy-ore.webp',
    starry: 'https://klawkla.com/content/images/2026/06/starry-ore.webp',
};
const COMMON_HIGHLIGHT_LEVELS = new Set([3, 6, 9, 12, 15, 18]);
const EPIC_HIGHLIGHT_LEVELS = new Set([9, 12, 15, 18, 21, 24, 27]);

const fmt = n => n.toLocaleString('en-US');

// ============ STATE ============
let currentType = 'common';

// ============ DOM ============
const typeBtns  = document.querySelectorAll('.typebtn');
const fromLv    = document.getElementById('fromLv');
const toLv      = document.getElementById('toLv');
const resultsEl = document.getElementById('results');
const tablesEl  = document.getElementById('rateTables');

// ============ CORE ============
function dataFor(type) { return type === 'epic' ? EPIC : COMMON; }
function maxLvFor(type) { return type === 'epic' ? 27 : 18; }

function clampInputs({ writeBack = false } = {}) {
    const max = maxLvFor(currentType);
    const min = 1;

    let from = parseInt(fromLv.value, 10);
    let to   = parseInt(toLv.value, 10);
    if (!Number.isFinite(from)) from = 1;
    if (!Number.isFinite(to))   to   = max;

    from = Math.max(min, Math.min(max, from));
    to   = Math.max(min, Math.min(max, to));

    fromLv.max = max;
    toLv.max   = max;

    if (writeBack) {
        fromLv.value = from;
        toLv.value   = to;
    }
    return { from, to };
}

function compute(from, to) {
    if (to <= from) return null;
    const rows = dataFor(currentType);
    let shiny = 0, glowy = 0, starry = 0;
    for (const r of rows) {
        if (r.lv > from && r.lv <= to) {
            shiny  += r.shiny;
            glowy  += r.glowy;
            starry += r.starry;
        }
    }
    const gems = shiny * GEM_PRICE.shiny + glowy * GEM_PRICE.glowy + starry * GEM_PRICE.starry;
    return { shiny, glowy, starry, gems };
}

function renderResults() {
    const { from, to } = clampInputs();
    const showStarry = currentType === 'epic';

    resultsEl.classList.toggle('calc-results--common', !showStarry);
    resultsEl.classList.toggle('calc-results--epic', showStarry);

    if (to <= from) {
        resultsEl.innerHTML = `
            <div class="calc-warning">
                ✦ เลเวลเป้าหมายต้องมากกว่าเลเวลปัจจุบัน
            </div>`;
        return;
    }

    const c = compute(from, to);
    const oreLabel = (key, label) => `
        <span class="result-label result-label--ore">
            <img class="result-ore-icon" src="${ORE_ICONS[key]}" alt="" width="24" height="24" loading="lazy" decoding="async" aria-hidden="true">
            ${label}
        </span>`;

    const starryChip = showStarry ? `
        <div class="result-chip result-chip--starry">
            ${oreLabel('starry', 'แร่ประกายดาว')}
            <span class="result-value">${fmt(c.starry)}</span>
            <span class="result-sub">= ${fmt(c.starry * GEM_PRICE.starry)} 💎</span>
        </div>` : '';

    resultsEl.innerHTML = `
        <div class="result-chip result-chip--shiny">
            ${oreLabel('shiny', 'แร่วิบวับ')}
            <span class="result-value">${fmt(c.shiny)}</span>
            <span class="result-sub">= ${fmt(c.shiny * GEM_PRICE.shiny)} 💎</span>
        </div>
        <div class="result-chip result-chip--glowy">
            ${oreLabel('glowy', 'แร่เรืองรอง')}
            <span class="result-value">${fmt(c.glowy)}</span>
            <span class="result-sub">= ${fmt(c.glowy * GEM_PRICE.glowy)} 💎</span>
        </div>
        ${starryChip}
        <div class="result-chip result-chip--total">
            <span class="result-label result-label--gem">
                <span class="result-gem-icon" aria-hidden="true">💎</span>
                จ่ายด้วยเพชร
            </span>
            <span class="result-value">${fmt(c.gems)}</span>
            <span class="result-sub">${from} → ${to}</span>
        </div>
    `;
}

function renderRateTable({ title, meta, rows, showStarry }) {
    const oreHead = (key, label) => `
        <span class="rate-ore-head">
            <img src="${ORE_ICONS[key]}" alt="" width="24" height="24" loading="lazy" decoding="async" aria-hidden="true">
            ${label}
        </span>`;

    const totals = rows.reduce((sum, r) => ({
        shiny: sum.shiny + r.shiny,
        glowy: sum.glowy + r.glowy,
        starry: sum.starry + r.starry,
    }), { shiny: 0, glowy: 0, starry: 0 });

    const starryHead = showStarry
        ? `<th scope="col">${oreHead('starry', 'ประกายดาว')}</th>`
        : '';
    const starryTotal = showStarry
        ? `<td>${fmt(totals.starry)}</td>`
        : '';

    const body = rows.map(r => {
        const keyClass = !showStarry && COMMON_HIGHLIGHT_LEVELS.has(r.lv)
            ? 'rate-row--common-key'
            : showStarry && EPIC_HIGHLIGHT_LEVELS.has(r.lv)
                ? 'rate-row--epic-key'
                : '';

        return `
        <tr class="${keyClass}">
            <td>${r.lv}</td>
            <td>${r.shiny ? fmt(r.shiny) : '—'}</td>
            <td>${r.glowy ? fmt(r.glowy) : '—'}</td>
            ${showStarry ? `<td>${r.starry ? fmt(r.starry) : '—'}</td>` : ''}
        </tr>`;
    }).join('');

    return `
        <section class="rate-table-block" aria-label="${title} ${meta}">
            <div class="rate-table-head">
                <h3>${title}</h3>
                <span>${meta}</span>
            </div>
            <div class="table-wrap" tabindex="0" aria-label="${title} ${meta}">
                <table class="rate-table">
                    <thead>
                        <tr>
                            <th scope="col">เลเวล</th>
                            <th scope="col">${oreHead('shiny', 'วิบวับ')}</th>
                            <th scope="col">${oreHead('glowy', 'เรืองรอง')}</th>
                            ${starryHead}
                        </tr>
                    </thead>
                    <tbody>${body}</tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">รวม</th>
                            <td>${fmt(totals.shiny)}</td>
                            <td>${fmt(totals.glowy)}</td>
                            ${starryTotal}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    `;
}

function renderTables() {
    tablesEl.innerHTML = [
        renderRateTable({
            title: 'อุปกรณ์คอมมอน',
            meta: '18 เลเวล',
            rows: COMMON,
            showStarry: false,
        }),
        renderRateTable({
            title: 'อุปกรณ์อีปิค',
            meta: '27 เลเวล',
            rows: EPIC,
            showStarry: true,
        }),
    ].join('');
}

// ============ HANDLERS ============
typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        if (type === currentType) return;
        currentType = type;

        typeBtns.forEach(b => {
            const active = b.dataset.type === type;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        fromLv.value = 1;
        toLv.value = maxLvFor(type);
        renderResults();
    });
});

[fromLv, toLv].forEach(el => {
    el.addEventListener('input', renderResults);
    el.addEventListener('blur', () => { clampInputs({ writeBack: true }); renderResults(); });
});

// initial
renderResults();
renderTables();
