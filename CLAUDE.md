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
├── index.html        # Cała treść strony (jedna strona, sekcje kotwiczone #id)
├── styles.css        # Cały wygląd: kolory, czcionki, układ, animacje, RWD
├── script.js         # Interakcje: menu mobilne, animacje pojawiania, liczniki, formularz
├── README.md         # Instrukcja dla właściciela (prostym językiem): jak edytować i publikować
├── CLAUDE.md         # Ten plik — dokumentacja techniczna dla Claude
├── .gitignore        # Pliki ignorowane przez git (.DS_Store, edytory, pliki tymczasowe)
└── assets/
    └── favicon.svg   # Ikonka strony (litera „F" w złotym kolorze) + miejsce na zdjęcia właściciela
```

Dodatkowo, w folderze nadrzędnym projektu istnieje `.claude/launch.json` — konfiguracja
lokalnego serwera podglądu (`python3 -m http.server 8077 --directory strona-pracowni`).
Podgląd lokalny: **http://localhost:8077**

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

**Ogólny styl:** ciemny, elegancki, premium. Dużo przestrzeni, duże zdjęcia wnętrz,
szeryfowe nagłówki dla klimatu „atelier".

### Kolory (zdefiniowane jako zmienne CSS w `:root` w `styles.css`)

| Zmienna | Wartość | Zastosowanie |
|---------|---------|--------------|
| `--bg` | `#0e0e10` | główne tło (prawie czarne) |
| `--bg-alt` | `#141417` | tło sekcji naprzemiennych |
| `--surface` | `#1a1a1f` | karty, formularz |
| `--line` | `rgba(255,255,255,0.09)` | subtelne linie / obramowania |
| `--text` | `#ece9e4` | główny tekst (ciepła biel) |
| `--text-soft` | `#a8a39b` | tekst drugorzędny (szary) |
| `--gold` | `#c5a572` | **kolor akcentu** — akcenty, przyciski, liczby |
| `--gold-soft` | `#d8c39a` | jaśniejsze złoto (hover) |

> Aby zmienić całą kolorystykę, wystarczy edytować te zmienne w jednym miejscu (`:root`).

### Czcionki (Google Fonts, ładowane w `index.html`)

- **Nagłówki:** „Cormorant Garamond" (szeryfowa, elegancka) — zmienna `--serif`.
- **Tekst:** „Inter" (bezszeryfowa, czytelna), grubość bazowa 300 — zmienna `--sans`.

### Układ i zasady

- Maksymalna szerokość treści: `--max: 1180px`, kontener `.container` (90% szerokości, wyśrodkowany).
- Zaokrąglenia: małe, `--radius: 4px` (styl premium, nie „zabawkowy").
- Nawigacja przyklejona u góry; po przewinięciu zyskuje rozmyte ciemne tło (`.nav.scrolled`).
- Animacje pojawiania: elementy z klasą `.reveal` są niewidoczne, dopóki nie wejdą w widok
  (obsługa przez IntersectionObserver w `script.js`). **Uwaga:** świeżo dodany element bez klasy
  `.reveal` pojawi się od razu; z klasą `.reveal` — animowany przy przewijaniu.
- Pełny RWD (telefon/tablet/desktop). Na telefonie menu zmienia się w wysuwany panel (hamburger).

---

## 4. Jakie strony i sekcje już istnieją

Strona jest **jednostronicowa** (one-page). Nawigacja przewija do sekcji (kotwice `#id`).
Kolejność sekcji w `index.html`:

1. **Nawigacja** (`#nav`) — logo „FORMA", linki, przycisk „Kontakt", hamburger na mobile.
2. **Hero** (`#hero`) — pełnoekranowe zdjęcie wnętrza, hasło „Przestrzenie, które oddychają elegancją",
   dwa przyciski: „Umów konsultację" i „Zobacz realizacje".
3. **O pracowni** (`#o-nas`) — opis + zdjęcie + statystyki (animowane liczniki:
   projekty / lata doświadczenia / nagrody).
4. **Usługi** (`#uslugi`) — 4 karty: Projektowanie wnętrz, Wnętrza komercyjne, Nadzór autorski, Konsultacje.
5. **Realizacje** (`#realizacje`) — galeria 5 projektów (siatka z kafelkami o różnych rozmiarach,
   podpisy pojawiają się po najechaniu).
6. **Proces** (`#proces`) — 4 kroki współpracy (brief → koncepcja → projekt techniczny → realizacja).
7. **Opinie** (`#opinie`) — 3 cytaty klientów.
8. **Kontakt** (`#kontakt`) — dane kontaktowe + formularz (imię, e-mail, wiadomość).
9. **Stopka** (`.footer`) — logo, linki, rok (automatyczny), nota o prawach autorskich.

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
