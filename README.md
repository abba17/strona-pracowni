# FORMA — strona pracowni architektury wnętrz

Gotowa, elegancka (ciemny motyw) strona-wizytówka dla biura projektowania wnętrz.
Nie wymaga żadnej instalacji ani programowania — to zwykłe pliki, które otwiera przeglądarka.

## Jak obejrzeć stronę

Kliknij dwukrotnie plik **`index.html`** — otworzy się w przeglądarce.
To wszystko. Strona działa od razu.

## Co tu jest

| Plik | Co zawiera |
|------|-----------|
| `index.html` | Treść strony (teksty, sekcje) |
| `styles.css` | Wygląd (kolory, czcionki, układ) |
| `script.js`  | Animacje i obsługa formularza |
| `assets/`    | Ikona strony (favicon) i miejsce na Twoje zdjęcia |

## Jak zmienić teksty

1. Otwórz `index.html` w dowolnym edytorze tekstu (np. TextEdit).
2. Znajdź tekst, który chcesz zmienić, i wpisz swój.
3. Zapisz plik i odśwież stronę w przeglądarce.

Najważniejsze rzeczy do podmiany na własne:
- **Nazwa pracowni** — wszędzie, gdzie jest słowo `FORMA`.
- **Dane kontaktowe** — e-mail `kontakt@forma-wnetrza.pl`, telefon `+48 123 456 789`, adres (w sekcji „Kontakt" oraz w pliku `script.js`).
- **Teksty o pracowni, usługi, opinie klientów, nazwy realizacji.**

## Jak podmienić zdjęcia

Obecnie strona używa przykładowych zdjęć wnętrz z internetu (serwis Unsplash).
Aby wstawić własne:
1. Wrzuć swoje zdjęcia do folderu `assets/` (np. `realizacja-1.jpg`).
2. W pliku `styles.css` znajdź adresy zaczynające się od `https://images.unsplash.com/...`
   i zamień je na nazwę swojego pliku, np. `url("assets/realizacja-1.jpg")`.

## Publikacja w internecie (GitHub Pages — za darmo)

Po wrzuceniu projektu na GitHub można włączyć darmowy hosting:
**Settings → Pages → Branch: `main` / folder `/ (root)` → Save**.
Po chwili strona będzie dostępna pod adresem `https://<twoja-nazwa>.github.io/strona-pracowni/`.

---
© FORMA — Pracownia Architektury Wnętrz
