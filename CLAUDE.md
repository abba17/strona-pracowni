# CLAUDE.md — strona pracowni architektury wnętrz „FORMA"

Ten plik to notatnik projektu dla Claude (i dla człowieka). Opisuje, czym jest projekt,
jak jest zbudowany, jakie decyzje wizualne podjęto i jakie są preferencje właściciela.
Czytaj go na początku każdej sesji, zanim zaczniesz cokolwiek zmieniać.

---

## 1. Czym jest ten projekt

Strona-wizytówka dla **biura projektowania wnętrz** (pełna strona, nie tylko landing).
Nazwa marki to placeholder **„FORMA"** — do podmiany na prawdziwą nazwę pracowni.

- **Technologia:** zwykłe statyczne pliki **HTML + CSS + JavaScript**. Brak frameworka,
  brak kroku budowania (`build`), brak zależności do instalowania. Otwiera się w przeglądarce.
- **Dlaczego tak:** właściciel nie programuje — statyczna strona jest najprostsza w utrzymaniu
  i działa za darmo na GitHub Pages.
- **Repozytorium:** https://github.com/abba17/strona-pracowni
- **Strona na żywo:** https://abba17.github.io/strona-pracowni/ (GitHub Pages, branch `main`, katalog `/`)
- **Hosting:** po każdym `git push` na `main` GitHub Pages automatycznie publikuje nową wersję.

---

## 2. Struktura folderów i plików

```
strona-pracowni/
├── index.html        # Cała treść strony głównej (jedna strona, sekcje kotwiczone #id)
├── kalkulator.html   # Podstrona: kalkulator kosztów wykończenia (link w nawigacji i stopce)
├── styles.css        # Cały wygląd: kolory, czcionki, układ, animacje, RWD + style kalkulatora (sekcja na końcu)
├── script.js         # Interakcje strony głównej: menu mobilne, animacje, liczniki, formularz
├── kalkulator.js     # Cała logika kalkulatora — ceny i prace w obiekcie CONFIG na górze pliku
├── README.md         # Instrukcja dla właściciela (prostym językiem): jak edytować i publikować
├── CLAUDE.md         # Ten plik — dokumentacja techniczna dla Claude
├── .gitignore        # Pliki ignorowane przez git (.DS_Store, edytory, pliki tymczasowe)
└── assets/
    └── favicon.svg   # Ikonka strony (litera „F" w złotym kolorze) + miejsce na zdjęcia właściciela
```

Dodatkowo, w folderze nadrzędnym projektu istnieje `.claude/launch.json` — konfiguracja
lokalnego serwera podglądu (`python3 -m http.server 8077 --directory strona-pracowni`).
Podgląd lokalny: **http://localhost:8077** (kalkulator: **http://localhost:8077/kalkulator.html**)

### Kalkulator kosztów wykończenia (`kalkulator.html` + `kalkulator.js`)

Osobna podstrona, spójna wizualnie ze stroną główną (te same czcionki i zmienne kolorów).
Klient dodaje pomieszczenia (z metrażem), wybiera standard (ekonomiczny / standardowy / premium),
zaznacza zakres prac, lokalizację oraz opcjonalnie usługę projektową — wycena (widełki + cena za m²)
liczy się na żywo. Przycisk „Wygeneruj PDF" otwiera okienko, w którym klient podaje e-mail (wymagany)
i zgodę; po tym pobiera się gotowy PDF z kosztorysem. PDF tworzy biblioteka **html2pdf.js** ładowana
z internetu (CDN) — renderuje obraz strony, więc polskie znaki wyglądają poprawnie.

- **Wszystkie ceny, standardy, regiony i lista prac są w obiekcie `CONFIG` na górze `kalkulator.js`.**
  Aby zmienić stawkę lub dodać/usunąć pracę — edytuje się tylko `CONFIG`, bez znajomości kodu.
- Ceny są orientacyjne (robocizna + materiały, rynek 2026) i pokazywane jako widełki ±12%.
- Dane pracowni na PDF (nazwa, e-mail, telefon) też są w `CONFIG.pracownia` — **to placeholdery do podmiany**.
- Lead (e-mail klienta) nie jest nigdzie wysyłany automatycznie (strona statyczna). Po pobraniu PDF
  klient dostaje link „Wyślij wycenę do pracowni" otwierający jego program pocztowy z gotową treścią.

### Do czego służy każdy plik

| Plik | Odpowiada za |
|------|--------------|
| `index.html` | Treść i strukturę: teksty, nagłówki, sekcje, galeria, formularz. Tu zmieniamy słowa. |
| `styles.css` | Cały wygląd. Tu zmieniamy kolory, czcionki, odstępy, adresy zdjęć. |
| `script.js`  | Zachowanie: rozwijane menu na telefonie, efekt pojawiania się sekcji, animowane liczniki, walidacja i wysyłka formularza (przez `mailto:`). |
| `README.md`  | Prosta instrukcja dla właściciela — jak podmienić teksty/zdjęcia, jak opublikować. |
| `assets/favicon.svg` | Mała ikona widoczna na karcie przeglądarki. |

---

## 3. Decyzje wizualne (design)

**Ogólny styl:** jasny, minimalistyczny, architektoniczny. Wzorowany na szablonie
**„Optik"** (https://optik-template.webflow.io/) — duża, pogrubiona typografia, dużo bieli,
monochromia (czarno-białe), przyciski-„pigułki" ze strzałką. Sekcja opinii i podsumowanie
kalkulatora są na ciemnym tle dla kontrastu.
> Wcześniej strona była ciemna/złota (Cormorant + Inter). Przeprojektowano na styl Optik 25.06.2026.

### Kolory (zdefiniowane jako zmienne CSS w `:root` w `styles.css`)

| Zmienna | Wartość | Zastosowanie |
|---------|---------|--------------|
| `--bg` | `#f4f3f1` | główne tło (ciepła biel) |
| `--bg-alt` | `#ebeae7` | tło sekcji naprzemiennych |
| `--surface` | `#ffffff` | karty, formularze |
| `--dark` | `#141414` | ciemne bloki (opinie, stopka, podsumowanie wyceny) |
| `--ink` / `--text` | `#141414` / `#1b1b1b` | nagłówki / tekst |
| `--text-soft` | `#6d6d6a` | tekst drugorzędny (szary) |
| `--line` / `--line-soft` | `rgba(0,0,0,.12)` / `.07` | obramowania / subtelne linie |
| `--gold` | `#141414` | **akcent** — w monochromii niemal czarny. Nazwa „--gold" zostaje dla zgodności z kalkulatorem. |
| `--gold-soft` | `#2c2c2c` | hover na przyciskach |
| `--on-accent` | `#ffffff` | tekst na ciemnym przycisku |

> Aby zmienić całą kolorystykę, wystarczy edytować te zmienne w jednym miejscu (`:root`).
> Zmiana `--bg`/`--surface`/`--gold` przeładowuje wygląd **i strony głównej, i kalkulatora**.

### Czcionki (Google Fonts, ładowane w `index.html` i `kalkulator.html`)

- **Nagłówki:** „Phudu" (gruba, geometryczna, lekko „architektoniczna") — zmienna `--serif`
  (nazwa zostaje dla zgodności; to teraz czcionka nagłówkowa, nie szeryfowa).
- **Tekst:** „Urbanist" (geometryczna bezszeryfowa), grubość bazowa 500 — zmienna `--sans`.

### Układ i zasady

- Maksymalna szerokość treści: `--max: 1200px`, kontener `.container` (90% szerokości, wyśrodkowany).
- Zaokrąglenia: `--radius: 10px`, karty `--radius-lg: 22px`, przyciski to pełne „pigułki" (999px).
- Przyciski `.btn` mają automatyczną strzałkę „→" (przez `::after`); aby ją wyłączyć — dodaj klasę `.btn--plain`.
- Nawigacja przyklejona u góry; po przewinięciu zyskuje rozmyte jasne tło (`.nav.scrolled`).
- Animacje pojawiania: elementy z klasą `.reveal` są niewidoczne, dopóki nie wejdą w widok
  (obsługa przez IntersectionObserver w `script.js`). **Uwaga:** świeżo dodany element bez klasy
  `.reveal` pojawi się od razu; z klasą `.reveal` — animowany przy przewijaniu.
- Pełny RWD (telefon/tablet/desktop). Na telefonie menu zmienia się w wysuwany panel (hamburger).

---

## 4. Jakie strony i sekcje już istnieją

Strona jest **jednostronicowa** (one-page). Nawigacja przewija do sekcji (kotwice `#id`).
Kolejność sekcji w `index.html`:

1. **Nawigacja** (`#nav`) — logo „FORMA", linki, „Kontakt" jako pigułka, hamburger na mobile.
2. **Hero** (`#hero`) — duży nagłówek Phudu „Od koncepcji po realizację…", dwa przyciski
   („Zobacz realizacje", „Umów konsultację") i szerokie zdjęcie wnętrza pod spodem.
3. **Pasek przewijany** (`.marquee`) — animowany pasek haseł („Architektura · Wnętrza mieszkalne…").
4. **O pracowni** (`#o-nas`) — opis + zdjęcie + statystyki (animowane liczniki:
   projekty / lata doświadczenia / nagrody).
5. **Usługi** (`#uslugi`) — 4 karty **ze zdjęciami**: Projektowanie wnętrz, Wnętrza komercyjne,
   Nadzór autorski, Konsultacje.
6. **Realizacje** (`#realizacje`) — galeria 4 projektów (zdjęcie + nazwa + lokalizacja z „pinezką").
7. **Proces** (`#proces`) — 4 kroki współpracy (brief → koncepcja → projekt techniczny → realizacja).
8. **Opinie** (`#opinie`) — sekcja na **ciemnym tle**, 3 cytaty klientów z gwiazdkami.
9. **Kontakt** (`#kontakt`) — dane kontaktowe + formularz (imię, e-mail, wiadomość).
10. **Stopka** (`.footer`) — **ciemna**, logo, linki, rok (automatyczny), nota o prawach autorskich.

---

## 5. Treści tymczasowe (placeholdery do podmiany na prawdziwe)

To dane przykładowe — **wymagają potwierdzenia / podmiany przez właściciela**:

- **Nazwa marki:** „FORMA" (występuje w nawigacji, stopce, favikonie, tytule strony).
- **Dane kontaktowe:** e-mail `kontakt@forma-wnetrza.pl`, tel. `+48 123 456 789`,
  adres „ul. Przykładowa 12, Warszawa". E-mail powtarza się też w `script.js` (wysyłka formularza).
- **Statystyki:** 120 projektów / 14 lat / 9 nagród — zmyślone.
- **Realizacje:** nazwy i metraże przykładowe; **zdjęcia** to linki do serwisu Unsplash
  (`https://images.unsplash.com/...` w `styles.css`).
- **Opinie klientów:** wymyślone.

### Jak podmienić zdjęcia na własne
Wrzucić pliki do `assets/`, a w `styles.css` zamienić adresy `https://images.unsplash.com/...`
na np. `url("assets/moje-zdjecie.jpg")`.

---

## 6. Formularz kontaktowy — jak działa

Strona jest statyczna, więc **nie wysyła e-maili samodzielnie**. Po wypełnieniu i kliknięciu
„Wyślij", `script.js` waliduje pola i otwiera domyślny program pocztowy użytkownika
(przez `mailto:`) z gotową treścią. Jeśli właściciel kiedyś będzie chciał prawdziwą wysyłkę
bez programu pocztowego, trzeba dodać zewnętrzną usługę (np. Formspree) — wtedy zaktualizować ten plik.

---

## 7. Preferencje właściciela (ważne przy każdej zmianie)

- **Nie programuje i nie chce się uczyć.** Pisz cały kod za niego, od początku do końca.
- **Pytaj o zgodę najrzadziej, jak się da.** Działaj samodzielnie; zatrzymuj się tylko przy rzeczach,
  które naprawdę może zrobić wyłącznie on (np. logowanie do konta).
- **Komunikuj się po polsku, prostym językiem** — bez żargonu technicznego.
- **Po zmianach publikuj automatycznie:** edytuj pliki → `git push` na `main` → strona online
  zaktualizuje się sama. Warto potem potwierdzić, że nowa wersja jest live.
- Konto GitHub właściciela: **abba17**.

---

## 8. Typowe zadania (ściągawka)

- **Zmiana tekstu/sekcji** → edytuj `index.html`.
- **Zmiana koloru/czcionki/odstępów** → edytuj zmienne w `:root` lub reguły w `styles.css`.
- **Zmiana zachowania (menu, formularz, animacje)** → edytuj `script.js`.
- **Podgląd lokalny** → serwer na http://localhost:8077 (konfiguracja w `../.claude/launch.json`).
- **Publikacja zmian** → z folderu `strona-pracowni/`: `git add -A && git commit -m "opis" && git push`.
- Commity podpisuj liniią: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
