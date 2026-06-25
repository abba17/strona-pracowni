/* ============================================================
   FORMA — Kalkulator kosztów wykończenia
   ------------------------------------------------------------
   Cały kalkulator sterowany jest jednym obiektem CONFIG poniżej.
   Aby zmienić ceny, standardy, regiony czy listę prac —
   wystarczy edytować CONFIG. Nie trzeba znać się na kodzie.
   Wszystkie kwoty są w złotówkach (zł) i obejmują robociznę
   wraz z materiałami (orientacyjnie, ceny rynkowe 2026).
   ============================================================ */

const CONFIG = {

  // O ile procent w górę i w dół pokazujemy widełki ceny (0.12 = ±12%)
  widelki: 0.12,

  // Standard wykończenia — mnożnik wpływa na cenę większości prac
  standardy: [
    { id: 'ekonomiczny', label: 'Ekonomiczny', mult: 0.80, opis: 'Materiały budżetowe, proste, funkcjonalne wykończenie.' },
    { id: 'standardowy', label: 'Standardowy', mult: 1.00, opis: 'Dobre, sprawdzone materiały i rozwiązania.' },
    { id: 'premium',     label: 'Premium',     mult: 1.55, opis: 'Materiały z wyższej półki, dbałość o detal.' },
  ],
  standardDomyslny: 'standardowy',

  // Lokalizacja — mnożnik cen robocizny
  regiony: [
    { id: 'duze',  label: 'Duże miasto', mult: 1.00 },
    { id: 'metro', label: 'Warszawa / Kraków / Trójmiasto / Wrocław', mult: 1.15 },
    { id: 'male',  label: 'Mniejsza miejscowość', mult: 0.90 },
  ],
  regionDomyslny: 'duze',

  // Typy pomieszczeń. mokra:true = wchodzi do "strefy mokrej"
  // (łazienki, WC, kuchnia) — tam liczą się prace hydrauliczne i płytki.
  typyPomieszczen: [
    { id: 'salon',     label: 'Salon',            mokra: false },
    { id: 'kuchnia',   label: 'Kuchnia',          mokra: true  },
    { id: 'sypialnia', label: 'Sypialnia',        mokra: false },
    { id: 'lazienka',  label: 'Łazienka',         mokra: true  },
    { id: 'wc',        label: 'WC / toaleta',     mokra: true  },
    { id: 'przedpokoj',label: 'Przedpokój / hol', mokra: false },
    { id: 'gabinet',   label: 'Gabinet / pokój',  mokra: false },
    { id: 'inne',      label: 'Inne pomieszczenie', mokra: false },
  ],

  // Pomieszczenia widoczne na starcie (przykładowe — klient je zmienia)
  pomieszczeniaStartowe: [
    { typ: 'salon',    m2: 25 },
    { typ: 'kuchnia',  m2: 8  },
    { typ: 'sypialnia',m2: 14 },
    { typ: 'lazienka', m2: 6  },
    { typ: 'przedpokoj', m2: 7 },
  ],

  // Prace. scope:
  //   'area'  — liczone od całej powierzchni (zł za każdy m²)
  //   'mokra' — liczone od powierzchni strefy mokrej (zł za m²)
  //   'szt'   — liczone od sztuk (np. drzwi)
  prace: [
    { id: 'rozbiorka',   label: 'Prace rozbiórkowe i przygotowawcze', grupa: 'Prace ogólne', scope: 'area', stawka: 60,  on: true,  hint: 'od 60 zł/m²' },
    { id: 'tynki',       label: 'Tynki, gładzie i przygotowanie ścian', grupa: 'Prace ogólne', scope: 'area', stawka: 220, on: true,  hint: 'od 220 zł/m²' },
    { id: 'malowanie',   label: 'Malowanie ścian i sufitów',          grupa: 'Prace ogólne', scope: 'area', stawka: 90,  on: true,  hint: 'od 90 zł/m²' },
    { id: 'podloga',     label: 'Podłogi (panele / deska + listwy)',  grupa: 'Prace ogólne', scope: 'area', stawka: 220, on: true,  hint: 'od 220 zł/m²' },
    { id: 'elektryka',   label: 'Instalacja elektryczna i osprzęt',   grupa: 'Prace ogólne', scope: 'area', stawka: 240, on: true,  hint: 'od 240 zł/m²' },
    { id: 'oswietlenie', label: 'Oświetlenie (punkty, montaż opraw)', grupa: 'Prace ogólne', scope: 'area', stawka: 90,  on: false, hint: 'od 90 zł/m²' },
    { id: 'sufity',      label: 'Sufity podwieszane / zabudowy z płyt G-K', grupa: 'Prace ogólne', scope: 'area', stawka: 120, on: false, hint: 'od 120 zł/m²' },

    { id: 'hydraulika',   label: 'Instalacja hydrauliczna',            grupa: 'Strefa mokra (łazienki, kuchnia)', scope: 'mokra', stawka: 350, on: true, hint: 'od 350 zł/m²' },
    { id: 'hydroizolacja',label: 'Hydroizolacja',                      grupa: 'Strefa mokra (łazienki, kuchnia)', scope: 'mokra', stawka: 90,  on: true, hint: 'od 90 zł/m²' },
    { id: 'plytki',       label: 'Płytki — glazura i terakota',        grupa: 'Strefa mokra (łazienki, kuchnia)', scope: 'mokra', stawka: 700, on: true, hint: 'od 700 zł/m²' },
    { id: 'bialymontaz',  label: 'Biały montaż (armatura, ceramika)',  grupa: 'Strefa mokra (łazienki, kuchnia)', scope: 'mokra', stawka: 550, on: true, hint: 'od 550 zł/m²' },

    { id: 'drzwi',  label: 'Drzwi wewnętrzne z montażem', grupa: 'Dodatki', scope: 'szt', stawka: 1100, on: true, qty: 5, hint: 'za sztukę' },
  ],

  // Usługa projektowa — niezależna od standardu (zł za m² całej powierzchni)
  projekt: { label: 'Projekt wnętrza', stawka: 150, on: false, hint: '150 zł/m² powierzchni' },

  // Dane pracowni (na PDF i do wysyłki zapytania)
  pracownia: {
    nazwa: 'FORMA',
    podtytul: 'Pracownia architektury wnętrz',
    email: 'kontakt@forma-wnetrza.pl',
    telefon: '+48 123 456 789',
  },
};

/* ============================================================
   Stan kalkulatora (to, co użytkownik wybrał)
   ============================================================ */
let stan = {
  pomieszczenia: [],                 // [{typ, m2}]
  standard: CONFIG.standardDomyslny,
  region: CONFIG.regionDomyslny,
  prace: {},                          // { idPracy: true/false }
  iloscDrzwi: {},                     // { idPracy: liczba } dla scope 'szt'
  projekt: CONFIG.projekt.on,
};

// inicjalizacja stanu na podstawie CONFIG
CONFIG.prace.forEach(p => {
  stan.prace[p.id] = p.on;
  if (p.scope === 'szt') stan.iloscDrzwi[p.id] = p.qty || 1;
});

/* ============================================================
   Narzędzia
   ============================================================ */
const zl = (n) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' zł';
const zaokr = (n) => Math.round(n / 100) * 100; // zaokrąglamy do pełnych 100 zł
const $ = (sel) => document.querySelector(sel);
const standardObj = () => CONFIG.standardy.find(s => s.id === stan.standard);
const regionObj   = () => CONFIG.regiony.find(r => r.id === stan.region);
const typObj      = (id) => CONFIG.typyPomieszczen.find(t => t.id === id);

function powierzchnie() {
  let total = 0, wet = 0;
  stan.pomieszczenia.forEach(p => {
    const m2 = parseFloat(p.m2) || 0;
    total += m2;
    if (typObj(p.typ) && typObj(p.typ).mokra) wet += m2;
  });
  return { total, wet };
}

/* ============================================================
   Główne obliczenie — zwraca listę pozycji i sumy
   ============================================================ */
function policz() {
  const { total, wet } = powierzchnie();
  const sMult = standardObj().mult;
  const rMult = regionObj().mult;
  const pozycje = [];

  CONFIG.prace.forEach(p => {
    if (!stan.prace[p.id]) return;
    let baza = 0;
    if (p.scope === 'area')  baza = p.stawka * total;
    if (p.scope === 'mokra') baza = p.stawka * wet;
    if (p.scope === 'szt')   baza = p.stawka * (parseInt(stan.iloscDrzwi[p.id], 10) || 0);
    const koszt = baza * sMult * rMult;
    if (koszt > 0) pozycje.push({ label: p.label, koszt });
  });

  // Usługa projektowa — nie zależy od standardu, ale od regionu tak
  if (stan.projekt && total > 0) {
    pozycje.push({ label: CONFIG.projekt.label, koszt: CONFIG.projekt.stawka * total * rMult });
  }

  const suma = pozycje.reduce((s, x) => s + x.koszt, 0);
  return {
    total, wet, pozycje,
    suma,
    min: suma * (1 - CONFIG.widelki),
    max: suma * (1 + CONFIG.widelki),
    perM2: total > 0 ? suma / total : 0,
  };
}

/* ============================================================
   Budowanie interfejsu (na podstawie CONFIG)
   ============================================================ */

// --- Pomieszczenia ---
function rysujPomieszczenia() {
  const box = $('#roomsContainer');
  box.innerHTML = '';
  stan.pomieszczenia.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'room-row';

    const sel = document.createElement('select');
    CONFIG.typyPomieszczen.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id; o.textContent = t.label;
      if (t.id === p.typ) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', () => { stan.pomieszczenia[i].typ = sel.value; odswiez(); });

    const inp = document.createElement('input');
    inp.type = 'number'; inp.min = '0'; inp.step = '1'; inp.value = p.m2;
    inp.setAttribute('aria-label', 'Powierzchnia w m²');
    inp.addEventListener('input', () => { stan.pomieszczenia[i].m2 = inp.value; odswiez(); });

    const del = document.createElement('button');
    del.type = 'button'; del.className = 'room-remove'; del.textContent = '×';
    del.setAttribute('aria-label', 'Usuń pomieszczenie');
    del.addEventListener('click', () => { stan.pomieszczenia.splice(i, 1); rysujPomieszczenia(); odswiez(); });

    row.append(sel, inp, del);
    box.appendChild(row);
  });
}

// --- Standard ---
function rysujStandard() {
  const box = $('#standardContainer');
  box.innerHTML = '';
  CONFIG.standardy.forEach(s => {
    const card = document.createElement('label');
    card.className = 'std-card' + (s.id === stan.standard ? ' is-active' : '');
    card.innerHTML =
      '<input type="radio" name="standard" value="' + s.id + '"' + (s.id === stan.standard ? ' checked' : '') + '>' +
      '<div class="std-card__name">' + s.label + '</div>' +
      '<div class="std-card__desc">' + s.opis + '</div>';
    card.querySelector('input').addEventListener('change', () => {
      stan.standard = s.id;
      rysujStandard();
      odswiez();
    });
    box.appendChild(card);
  });
}

// --- Prace (pogrupowane) ---
function rysujPrace() {
  const box = $('#worksContainer');
  box.innerHTML = '';
  const grupy = [];
  CONFIG.prace.forEach(p => { if (!grupy.includes(p.grupa)) grupy.push(p.grupa); });

  grupy.forEach(g => {
    const wrap = document.createElement('div');
    wrap.className = 'work-group';
    wrap.innerHTML = '<div class="work-group__title">' + g + '</div>';

    CONFIG.prace.filter(p => p.grupa === g).forEach(p => {
      const item = document.createElement('div');
      item.className = 'work-item';

      const check = document.createElement('span');
      check.className = 'work-check' + (stan.prace[p.id] ? ' is-on' : '');
      check.setAttribute('role', 'checkbox');
      check.setAttribute('tabindex', '0');
      check.setAttribute('aria-checked', stan.prace[p.id] ? 'true' : 'false');

      const text = document.createElement('div');
      text.className = 'work-text';
      text.innerHTML = '<span class="work-label">' + p.label + '</span>' +
                       (p.hint ? '<span class="work-hint">' + p.hint + '</span>' : '');

      const toggle = () => {
        stan.prace[p.id] = !stan.prace[p.id];
        check.classList.toggle('is-on', stan.prace[p.id]);
        check.setAttribute('aria-checked', stan.prace[p.id] ? 'true' : 'false');
        odswiez();
      };
      check.addEventListener('click', toggle);
      check.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
      text.addEventListener('click', toggle);

      item.append(check, text);

      // pole na liczbę sztuk (np. drzwi)
      if (p.scope === 'szt') {
        const qty = document.createElement('div');
        qty.className = 'work-qty';
        const qi = document.createElement('input');
        qi.type = 'number'; qi.min = '0'; qi.step = '1';
        qi.value = stan.iloscDrzwi[p.id];
        qi.setAttribute('aria-label', 'Liczba sztuk');
        qi.addEventListener('input', () => { stan.iloscDrzwi[p.id] = qi.value; odswiez(); });
        qty.append(document.createTextNode('szt.'), qi);
        item.appendChild(qty);
      }

      wrap.appendChild(item);
    });
    box.appendChild(wrap);
  });
}

// --- Region ---
function rysujRegion() {
  const sel = $('#regionSelect');
  sel.innerHTML = '';
  CONFIG.regiony.forEach(r => {
    const o = document.createElement('option');
    o.value = r.id; o.textContent = r.label;
    if (r.id === stan.region) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener('change', () => { stan.region = sel.value; odswiez(); });
}

// --- Projekt (toggle) ---
function rysujProjekt() {
  const check = $('#projektCheck');
  $('#projektLabel').textContent = CONFIG.projekt.label;
  $('#projektHint').textContent = CONFIG.projekt.hint;
  const set = () => {
    check.classList.toggle('is-on', stan.projekt);
    check.setAttribute('aria-checked', stan.projekt ? 'true' : 'false');
  };
  set();
  const toggle = () => { stan.projekt = !stan.projekt; set(); odswiez(); };
  check.addEventListener('click', toggle);
  check.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
  $('#projektLabel').style.cursor = 'pointer';
  $('#projektLabel').addEventListener('click', toggle);
}

/* ============================================================
   Odświeżanie podsumowania
   ============================================================ */
function odswiez() {
  const w = policz();

  $('#metaTotal').textContent = w.total.toFixed(0) + ' m²';
  $('#metaWet').textContent = w.wet.toFixed(0) + ' m²';
  $('#sumArea').textContent = w.total.toFixed(0) + ' m²';
  $('#sumStd').textContent = standardObj().label;

  const items = $('#sumItems');
  if (w.pozycje.length === 0 || w.total === 0) {
    items.innerHTML = '<p class="sum-empty">Dodaj pomieszczenia i&nbsp;zaznacz prace, aby zobaczyć wycenę.</p>';
    $('#sumTotal').textContent = '— zł';
    $('#sumPerM2').textContent = '';
    return;
  }

  items.innerHTML = '';
  w.pozycje.forEach(p => {
    const row = document.createElement('div');
    row.className = 'sum-item';
    row.innerHTML = '<span>' + p.label + '</span><span>' + zl(zaokr(p.koszt)) + '</span>';
    items.appendChild(row);
  });

  $('#sumTotal').textContent = zl(zaokr(w.min)) + ' – ' + zl(zaokr(w.max));
  $('#sumPerM2').textContent = 'czyli ok. ' + zl(zaokr(w.perM2)) + '/m²';
}

/* ============================================================
   Generowanie PDF (po podaniu e-maila)
   ============================================================ */
function dzisDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return { tekst: dd + '.' + mm + '.' + d.getFullYear(), plik: d.getFullYear() + '-' + mm + '-' + dd };
}

function budujKosztorysHTML(lead) {
  const w = policz();
  const data = dzisDate();
  const p = CONFIG.pracownia;

  const wiersze = w.pozycje.map(poz =>
    '<tr>' +
      '<td style="padding:9px 0;border-bottom:1px solid #eee;color:#333;font-size:13px;">' + poz.label + '</td>' +
      '<td style="padding:9px 0;border-bottom:1px solid #eee;color:#111;font-size:13px;text-align:right;white-space:nowrap;">' + zl(zaokr(poz.koszt)) + '</td>' +
    '</tr>'
  ).join('');

  const pomieszczeniaTekst = stan.pomieszczenia
    .filter(x => (parseFloat(x.m2) || 0) > 0)
    .map(x => typObj(x.typ).label + ' (' + (parseFloat(x.m2) || 0) + ' m²)')
    .join(', ');

  const klient = [];
  if (lead.name)  klient.push('<strong>Klient:</strong> ' + lead.name);
  klient.push('<strong>E-mail:</strong> ' + lead.email);
  if (lead.phone) klient.push('<strong>Telefon:</strong> ' + lead.phone);

  return '' +
  '<div style="width:720px;padding:48px 54px;background:#ffffff;color:#222;font-family:Arial,Helvetica,sans-serif;box-sizing:border-box;">' +

    // nagłówek
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #c5a572;padding-bottom:18px;margin-bottom:26px;">' +
      '<div>' +
        '<div style="font-size:30px;letter-spacing:4px;font-weight:bold;color:#1a1a1f;">' + p.nazwa + '<span style="color:#c5a572;">.</span></div>' +
        '<div style="font-size:12px;color:#888;letter-spacing:1px;margin-top:2px;">' + p.podtytul + '</div>' +
      '</div>' +
      '<div style="text-align:right;font-size:12px;color:#666;line-height:1.6;">' +
        p.email + '<br>' + p.telefon +
      '</div>' +
    '</div>' +

    '<div style="font-size:22px;color:#1a1a1f;margin-bottom:4px;">Wstępna wycena wykończenia</div>' +
    '<div style="font-size:12px;color:#999;margin-bottom:24px;">Data: ' + data.tekst + '</div>' +

    // dane klienta
    '<div style="background:#faf8f3;border:1px solid #ece4d4;border-radius:4px;padding:14px 18px;font-size:13px;color:#444;line-height:1.8;margin-bottom:24px;">' +
      klient.join('&nbsp;&nbsp;·&nbsp;&nbsp;') +
    '</div>' +

    // parametry
    '<div style="font-size:13px;color:#444;line-height:1.9;margin-bottom:22px;">' +
      '<strong>Powierzchnia:</strong> ' + w.total.toFixed(0) + ' m² (w tym strefa mokra ' + w.wet.toFixed(0) + ' m²)<br>' +
      '<strong>Standard:</strong> ' + standardObj().label + '&nbsp;&nbsp;·&nbsp;&nbsp;<strong>Lokalizacja:</strong> ' + regionObj().label + '<br>' +
      (pomieszczeniaTekst ? '<strong>Pomieszczenia:</strong> ' + pomieszczeniaTekst : '') +
    '</div>' +

    // tabela pozycji
    '<table style="width:100%;border-collapse:collapse;margin-bottom:10px;">' +
      '<thead><tr>' +
        '<th style="text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#c5a572;padding-bottom:6px;border-bottom:2px solid #c5a572;">Zakres prac</th>' +
        '<th style="text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#c5a572;padding-bottom:6px;border-bottom:2px solid #c5a572;">Koszt orientacyjny</th>' +
      '</tr></thead>' +
      '<tbody>' + wiersze + '</tbody>' +
    '</table>' +

    // suma
    '<div style="margin-top:22px;padding:18px 22px;background:#1a1a1f;border-radius:4px;color:#fff;">' +
      '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c5a572;">Szacowany koszt całkowity</div>' +
      '<div style="font-size:26px;margin:6px 0 2px;">' + zl(zaokr(w.min)) + ' – ' + zl(zaokr(w.max)) + '</div>' +
      '<div style="font-size:12px;color:#bbb;">czyli ok. ' + zl(zaokr(w.perM2)) + ' za m²</div>' +
    '</div>' +

    // nota
    '<div style="font-size:11px;color:#999;line-height:1.7;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">' +
      'Powyższe wyliczenie ma charakter wyłącznie orientacyjny i poglądowy. Nie stanowi oferty handlowej ' +
      'w rozumieniu Kodeksu cywilnego. Ostateczny koszt zależy od szczegółowego zakresu prac, wybranych materiałów ' +
      'oraz stanu technicznego lokalu. Zapraszamy do kontaktu — przygotujemy dokładny kosztorys dopasowany do Twojego projektu.' +
    '</div>' +

    '<div style="text-align:center;font-size:12px;color:#c5a572;letter-spacing:2px;margin-top:22px;">' +
      p.nazwa + ' — ' + p.podtytul +
    '</div>' +

  '</div>';
}

function generujPDF(lead) {
  const stage = $('#pdfStage');
  stage.innerHTML = budujKosztorysHTML(lead);
  const el = stage.firstChild;
  const data = dzisDate();

  const opt = {
    margin: 0,
    filename: 'Wycena-FORMA-' + data.plik + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  return html2pdf().set(opt).from(el).save().then(() => { stage.innerHTML = ''; });
}

/* Po pobraniu — przygotuj link, by klient mógł wysłać wycenę do pracowni */
function linkZapytania(lead) {
  const w = policz();
  const p = CONFIG.pracownia;
  const tytul = 'Zapytanie z kalkulatora — wycena wykończenia';
  const tresc =
    'Dzień dobry,\n\nkorzystałem(-am) z kalkulatora na Państwa stronie i chciałbym(-abym) porozmawiać o wycenie.\n\n' +
    'Imię: ' + (lead.name || '—') + '\n' +
    'E-mail: ' + lead.email + '\n' +
    'Telefon: ' + (lead.phone || '—') + '\n\n' +
    'Powierzchnia: ' + w.total.toFixed(0) + ' m² (strefa mokra ' + w.wet.toFixed(0) + ' m²)\n' +
    'Standard: ' + standardObj().label + '\n' +
    'Lokalizacja: ' + regionObj().label + '\n' +
    'Szacowany koszt: ' + zl(zaokr(w.min)) + ' – ' + zl(zaokr(w.max)) + '\n\nPozdrawiam';
  return 'mailto:' + p.email + '?subject=' + encodeURIComponent(tytul) + '&body=' + encodeURIComponent(tresc);
}

/* ============================================================
   Okienko (modal) na e-mail
   ============================================================ */
function ustawModal() {
  const modal = $('#modal');
  const form = $('#leadForm');
  const note = $('#modalNote');

  const otworz = () => {
    const w = policz();
    if (w.total === 0 || w.pozycje.length === 0) {
      // nic do policzenia — delikatnie zwróć uwagę
      const s = $('#summary');
      s.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 280 });
      return;
    }
    note.textContent = ''; note.className = 'modal__note';
    modal.classList.add('open');
    $('#leadEmail').focus();
  };
  const zamknij = () => modal.classList.remove('open');

  $('#pdfBtn').addEventListener('click', otworz);
  $('#modalCancel').addEventListener('click', zamknij);
  modal.addEventListener('click', (e) => { if (e.target === modal) zamknij(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') zamknij(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lead = {
      name: $('#leadName').value.trim(),
      email: $('#leadEmail').value.trim(),
      phone: $('#leadPhone').value.trim(),
    };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
    if (!emailOk) {
      note.textContent = 'Podaj poprawny adres e-mail, abyśmy mogli przygotować wycenę.';
      note.className = 'modal__note err';
      return;
    }
    if (!$('#leadConsent').checked) {
      note.textContent = 'Zaznacz zgodę, aby pobrać wycenę.';
      note.className = 'modal__note err';
      return;
    }

    note.textContent = 'Generujemy Twój plik PDF…';
    note.className = 'modal__note ok';

    generujPDF(lead).then(() => {
      note.innerHTML = 'Gotowe! Plik PDF został pobrany. ' +
        '<a href="' + linkZapytania(lead) + '" style="color:var(--gold);text-decoration:underline;">Wyślij wycenę do pracowni →</a>';
      note.className = 'modal__note ok';
    }).catch(() => {
      note.textContent = 'Coś poszło nie tak przy tworzeniu PDF. Spróbuj ponownie.';
      note.className = 'modal__note err';
    });
  });
}

/* ============================================================
   Wspólne zachowania strony (nawigacja, animacje, rok)
   ============================================================ */
function ustawNawigacje() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40 || true);
  onScroll();

  const burger = $('#burger');
  const links = $('#navLinks');
  if (burger && links) {
    const toggleMenu = (open) => {
      burger.classList.toggle('open', open);
      links.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', () => toggleMenu(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  }

  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
}

/* ============================================================
   Start
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // pomieszczenia startowe
  stan.pomieszczenia = CONFIG.pomieszczeniaStartowe.map(p => ({ typ: p.typ, m2: p.m2 }));

  rysujPomieszczenia();
  rysujStandard();
  rysujPrace();
  rysujRegion();
  rysujProjekt();
  ustawModal();
  ustawNawigacje();
  odswiez();

  $('#addRoom').addEventListener('click', () => {
    stan.pomieszczenia.push({ typ: 'salon', m2: 10 });
    rysujPomieszczenia();
    odswiez();
  });
});
