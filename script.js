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

const fmt = n => n.toLocaleString('en-US');

// ============ STATE ============
let currentType = 'common';

// ============ DOM ============
const typeBtns  = document.querySelectorAll('.typebtn');
const fromLv    = document.getElementById('fromLv');
const toLv      = document.getElementById('toLv');
const resultsEl = document.getElementById('results');
const tableEl   = document.getElementById('rateTable');

// ============ CORE ============
function dataFor(type) { return type === 'epic' ? EPIC : COMMON; }
function maxLvFor(type) { return type === 'epic' ? 27 : 18; }

function clampInputs() {
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
    fromLv.value = from;
    toLv.value   = to;
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

    if (to <= from) {
        resultsEl.innerHTML = `
            <div class="calc-warning">
                ✦ เลเวลเป้าหมายต้องมากกว่าเลเวลปัจจุบัน
            </div>`;
        return;
    }

    const c = compute(from, to);
    const showStarry = currentType === 'epic';

    const starryChip = showStarry ? `
        <div class="result-chip result-chip--starry">
            <span class="result-label">แร่ประกายดาว</span>
            <span class="result-value">${fmt(c.starry)}</span>
            <span class="result-sub">= ${fmt(c.starry * GEM_PRICE.starry)} เพชร</span>
        </div>` : '';

    resultsEl.innerHTML = `
        <div class="result-chip result-chip--shiny">
            <span class="result-label">แร่วิบวับ</span>
            <span class="result-value">${fmt(c.shiny)}</span>
            <span class="result-sub">= ${fmt(c.shiny * GEM_PRICE.shiny)} เพชร</span>
        </div>
        <div class="result-chip result-chip--glowy">
            <span class="result-label">แร่เรืองรอง</span>
            <span class="result-value">${fmt(c.glowy)}</span>
            <span class="result-sub">= ${fmt(c.glowy * GEM_PRICE.glowy)} เพชร</span>
        </div>
        ${starryChip}
        <div class="result-chip result-chip--total">
            <span class="result-label">จ่ายด้วยเพชร</span>
            <span class="result-value">${fmt(c.gems)}</span>
            <span class="result-sub">${from} → ${to}</span>
        </div>
    `;
}

function renderTable() {
    const rows = dataFor(currentType);
    const showStarry = currentType === 'epic';

    const head = `
        <thead>
            <tr>
                <th>เลเวล</th>
                <th><span class="rate-dot rate-dot--shiny"></span>วิบวับ</th>
                <th><span class="rate-dot rate-dot--glowy"></span>เรืองรอง</th>
                ${showStarry ? '<th><span class="rate-dot rate-dot--starry"></span>ประกายดาว</th>' : ''}
                <th>เพชรรวม</th>
            </tr>
        </thead>`;

    const body = rows.map(r => {
        const gems = r.shiny * GEM_PRICE.shiny + r.glowy * GEM_PRICE.glowy + r.starry * GEM_PRICE.starry;
        return `
            <tr>
                <td>${r.lv}</td>
                <td>${r.shiny ? fmt(r.shiny) : '—'}</td>
                <td>${r.glowy ? fmt(r.glowy) : '—'}</td>
                ${showStarry ? `<td>${r.starry ? fmt(r.starry) : '—'}</td>` : ''}
                <td>${gems ? fmt(gems) : '—'}</td>
            </tr>
        `;
    }).join('');

    tableEl.innerHTML = head + '<tbody>' + body + '</tbody>';
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

        // adjust bounds; if prior "to" exceeded new max, rerender will clamp.
        renderResults();
        renderTable();
    });
});

[fromLv, toLv].forEach(el => el.addEventListener('input', renderResults));

// initial
renderResults();
renderTable();
