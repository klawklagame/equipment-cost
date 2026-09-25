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
    shiny: 'images/shiny-ore.webp',
    glowy: 'images/glowy-ore.webp',
    starry: 'images/starry-ore.webp',
};
const TYPE_NAME = { common: 'คอมมอน', epic: 'อีปิค' };
const COMMON_HIGHLIGHT_LEVELS = new Set([3, 6, 9, 12, 15, 18]);
const EPIC_HIGHLIGHT_LEVELS = new Set([9, 12, 15, 18, 21, 24, 27]);

const fmt = n => n.toLocaleString('en-US');
const NBSP = ' ';
const keep = word => `<span class="kk-keep">${word}</span>`;

// ============ STATE ============
let currentType = 'common';
let tapAnchor = null;

// ============ DOM ============
const typeBtns  = document.querySelectorAll('.kk-seg-opt[data-type]');
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

/* Disable a stepper key when its level is already at the edge */
function syncStepperKeys() {
    const max = maxLvFor(currentType);
    document.querySelectorAll('.kk-stepper-key[data-target]').forEach(btn => {
        const el = btn.dataset.target === 'fromLv' ? fromLv : toLv;
        const v = parseInt(el.value, 10);
        const step = parseInt(btn.dataset.step, 10);
        btn.disabled = Number.isFinite(v) && (step < 0 ? v <= 1 : v >= max);
    });
}

function renderResults() {
    const { from, to } = clampInputs();
    const showStarry = currentType === 'epic';
    syncStepperKeys();

    if (to <= from) {
        resultsEl.innerHTML = `
            <div class="kk-empty">
                <p class="kk-empty-hint">เลเวลเป้าหมายต้องมากกว่าเลเวลปัจจุบัน</p>
            </div>`;
        syncTableHighlight();
        return;
    }

    const c = compute(from, to);
    const oreTile = (key, label) => `
        <div class="kk-stat kk-stat--${key}">
            <span class="kk-stat-label"><img src="${ORE_ICONS[key]}" alt="" width="24" height="24" decoding="async">${label}</span>
            <span class="kk-stat-value">${fmt(c[key])}</span>
            <span class="kk-stat-sub">=${NBSP}${fmt(c[key] * GEM_PRICE[key])}${NBSP}เพชร</span>
        </div>`;

    resultsEl.innerHTML = `
        ${oreTile('shiny', 'แร่วิบวับ')}
        ${oreTile('glowy', 'แร่เรืองรอง')}
        ${showStarry ? oreTile('starry', 'แร่ประกายดาว') : ''}
        <div class="kk-stat kk-stat--total kk-stat--wide">
            <span class="kk-stat-label"><svg class="kk-icon" aria-hidden="true"><use href="#kk-gem"/></svg>จ่ายด้วยเพชร</span>
            <span class="kk-stat-value">${fmt(c.gems)}</span>
            <span class="kk-stat-sub">${keep(TYPE_NAME[currentType])} เลเวล ${from} → ${to}</span>
        </div>
    `;
    syncTableHighlight();
}

function syncTableHighlight() {
    const { from, to } = clampInputs();
    const inRange = to > from;

    tablesEl.querySelectorAll('.ec-table-block').forEach(block => {
        const active = block.dataset.equipmentType === currentType;
        block.querySelector('.ec-active-tag').hidden = !active;

        block.querySelectorAll('.kk-table tbody tr[data-lv]').forEach(row => {
            const lv = parseInt(row.dataset.lv, 10);
            const anchored = active && tapAnchor !== null && lv === tapAnchor;
            const selected = active && inRange && lv > from && lv <= to && !anchored;
            row.classList.toggle('is-range', selected);
            row.classList.toggle('is-anchor', anchored);
        });
    });
}

function setEquipmentType(type, { resetLevels = false } = {}) {
    if (type !== currentType) {
        currentType = type;
        tapAnchor = null;

        typeBtns.forEach(b => {
            b.setAttribute('aria-selected', b.dataset.type === type ? 'true' : 'false');
        });
    }

    if (resetLevels) {
        tapAnchor = null;
        fromLv.value = 1;
        toLv.value = maxLvFor(type);
    }

    fromLv.max = maxLvFor(type);
    toLv.max = maxLvFor(type);
}

function applyLevels(from, to) {
    fromLv.value = from;
    toLv.value = to;
    tapAnchor = null;
    renderResults();
}

function handleTableRowTap(equipmentType, lv) {
    if (equipmentType !== currentType) {
        setEquipmentType(equipmentType);
    }

    if (tapAnchor === null) {
        tapAnchor = lv;
        fromLv.value = lv;
        renderResults();
        return;
    }

    let from = tapAnchor;
    let to = lv;

    if (to === from) {
        if (from > 1) {
            from -= 1;
        } else {
            to = Math.min(from + 1, maxLvFor(currentType));
        }
    } else if (to < from) {
        [from, to] = [to, from];
    }

    applyLevels(from, to);
}

function renderRateTable({ name, meta, rows, showStarry, equipmentType }) {
    const title = `อุปกรณ์${keep(name)}`;
    const label = `อุปกรณ์${name} ${meta}`;
    const oreHead = (key, label) => `
        <span class="kk-th-icon">
            <img src="${ORE_ICONS[key]}" alt="" width="22" height="22" loading="lazy" decoding="async">
            ${label}
        </span>`;
    const cell = n => n ? `<td>${fmt(n)}</td>` : `<td class="is-zero">–</td>`;

    const totals = rows.reduce((sum, r) => ({
        shiny: sum.shiny + r.shiny,
        glowy: sum.glowy + r.glowy,
        starry: sum.starry + r.starry,
    }), { shiny: 0, glowy: 0, starry: 0 });

    const keyLevels = showStarry ? EPIC_HIGHLIGHT_LEVELS : COMMON_HIGHLIGHT_LEVELS;
    const keyLegend = showStarry ? 'เลเวลที่ใช้แร่ประกายดาว' : 'เลเวลที่ใช้แร่เรืองรอง';

    const body = rows.map(r => `
        <tr${keyLevels.has(r.lv) ? ' class="is-key"' : ''} data-lv="${r.lv}" tabindex="0" role="button" aria-label="เลเวล ${r.lv}">
            <td><span class="kk-lv">${r.lv}</span></td>
            ${cell(r.shiny)}
            ${cell(r.glowy)}
            ${showStarry ? cell(r.starry) : ''}
        </tr>`).join('');

    return `
        <section class="ec-table-block" data-equipment-type="${equipmentType}" aria-label="${label}">
            <div class="ec-table-head">
                <h3 class="ec-table-title">${title}</h3>
                <span class="ec-table-meta">${meta}</span>
                <span class="kk-tag kk-tag--elixir ec-active-tag" hidden>กำลังคำนวณ</span>
            </div>
            <div class="kk-table-wrap" tabindex="0" aria-label="${label}">
                <table class="kk-table">
                    <thead>
                        <tr>
                            <th scope="col">เลเวล</th>
                            <th scope="col">${oreHead('shiny', 'วิบวับ')}</th>
                            <th scope="col">${oreHead('glowy', 'เรืองรอง')}</th>
                            ${showStarry ? `<th scope="col">${oreHead('starry', 'ประกายดาว')}</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>${body}</tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">รวม 1 → ${rows.length}</th>
                            <td>${fmt(totals.shiny)}</td>
                            <td>${fmt(totals.glowy)}</td>
                            ${showStarry ? `<td>${fmt(totals.starry)}</td>` : ''}
                        </tr>
                    </tfoot>
                </table>
            </div>
            <p class="kk-table-note">
                <span><i class="kk-swatch"></i>${keyLegend}</span>
                <span><i class="kk-swatch kk-swatch--range"></i>ช่วงที่คำนวณ</span>
            </p>
        </section>
    `;
}

function renderTables() {
    tablesEl.innerHTML = [
        renderRateTable({
            name: 'คอมมอน',
            meta: '18 เลเวล',
            rows: COMMON,
            showStarry: false,
            equipmentType: 'common',
        }),
        renderRateTable({
            name: 'อีปิค',
            meta: '27 เลเวล',
            rows: EPIC,
            showStarry: true,
            equipmentType: 'epic',
        }),
    ].join('');
    syncTableHighlight();
}

// ============ HANDLERS ============
typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        if (type === currentType) return;
        setEquipmentType(type, { resetLevels: true });
        renderResults();
    });
});

document.querySelectorAll('.kk-stepper-key[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
        const el = btn.dataset.target === 'fromLv' ? fromLv : toLv;
        const max = maxLvFor(currentType);
        let v = parseInt(el.value, 10);
        if (!Number.isFinite(v)) v = 1;
        el.value = Math.max(1, Math.min(max, v + parseInt(btn.dataset.step, 10)));
        tapAnchor = null;
        renderResults();
    });
});

document.querySelectorAll('.kk-chip[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
        const max = maxLvFor(currentType);
        const { from } = clampInputs();
        if (btn.dataset.preset === 'all') {
            applyLevels(1, max);
        } else if (btn.dataset.preset === 'to-max') {
            applyLevels(Math.min(from, max - 1), max);
        } else {
            applyLevels(Math.min(from, max - 1), Math.min(from + 1, max));
        }
    });
});

[fromLv, toLv].forEach(el => {
    el.addEventListener('focus', () => el.select());
    el.addEventListener('input', () => {
        tapAnchor = null;
        renderResults();
    });
    el.addEventListener('blur', () => { clampInputs({ writeBack: true }); renderResults(); });
});

function onTableRowActivate(row) {
    const block = row.closest('.ec-table-block');
    if (!block) return;
    handleTableRowTap(block.dataset.equipmentType, parseInt(row.dataset.lv, 10));
}

tablesEl.addEventListener('click', (e) => {
    const row = e.target.closest('.kk-table tbody tr[data-lv]');
    if (!row) return;
    onTableRowActivate(row);
});

tablesEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('.kk-table tbody tr[data-lv]');
    if (!row) return;
    e.preventDefault();
    onTableRowActivate(row);
});

// initial
renderResults();
renderTables();
