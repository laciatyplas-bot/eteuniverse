# 🌟 Eterniverse - Professional Publishing Website

Pełnowymiarowa, profesjonalna strona internetowa wydawnictwa Eterniverse z pełną funkcjonalnością redakcyjną i katalogiem książek.

## ✨ Funkcje

### 🏠 Strona Główna
- Efektowny hero section z animacjami
- Statystyki w czasie rzeczywistym
- Sekcja bestselerów z dużymi kartami książek
- Floating books animation
- Smooth scroll indicators

### 📚 Katalog Książek
- Pełny katalog z 12+ książkami
- Zaawansowane filtry (Wszystkie, SEEKER, Filozofia, Transformacja, Premium)
- System ocen i recenzji
- Informacje o autorach i rozdziałach
- Responsywna siatka książek

### 🌍 Światy Eterniverse
- 3 unikalne światy literackie
- Statystyki każdego świata
- Kolorowe oznaczenia tematyczne
- Call-to-action buttons

### 👥 O Nas & Zespół
- Historia wydawnictwa
- 4-osobowa redakcja z bio
- Statystyki firmy
- Social media links

### 📝 Blog & Aktualności
- Featured posts
- Grid layout dla wpisów
- Kategorie i meta dane
- Data publikacji i czas czytania

### 💌 Newsletter
- Formularz zapisu
- Gradient background
- Statystyki subskrybentów

### 📞 Kontakt
- Pełny formularz kontaktowy
- Informacje kontaktowe (email, telefon, adres)
- Social media integration
- Mapy Google (gotowe do integracji)

### 🔍 Wyszukiwarka
- Full-screen search overlay
- Live suggestions
- Smooth animations

## 🗂️ Struktura Plików

```
eterniverse-desktop/
├── index.html          # Główny plik HTML (struktura)
├── css/
│   └── desktop.css     # Wszystkie style (kompletne)
├── js/
│   └── desktop.js      # Cała logika aplikacji
├── images/             # (opcjonalne - na przyszłość)
│   ├── books/
│   ├── team/
│   └── blog/
└── README-DESKTOP.md   # Ta dokumentacja
```

## 🚀 Instalacja

### Metoda 1: Bezpośrednie otwarcie

1. **Sklonuj/pobierz repozytorium**
```bash
git clone https://github.com/twoj-username/eterniverse-desktop.git
cd eterniverse-desktop
```

2. **Otwórz w przeglądarce**
- Kliknij dwukrotnie na `index.html`
- LUB przeciągnij plik do przeglądarki

### Metoda 2: Lokalny serwer (zalecane)

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

Następnie otwórz: `http://localhost:8000`

### Metoda 3: Live Server (VS Code)

1. Zainstaluj rozszerzenie "Live Server"
2. Kliknij prawym na `index.html`
3. Wybierz "Open with Live Server"

## 🎨 Personalizacja

### Zmiana Kolorów

W pliku `css/desktop.css` znajdź sekcję zmiennych CSS:

```css
:root {
    --primary: #3b82f6;        /* Niebieski - główny kolor */
    --secondary: #8b5cf6;      /* Fioletowy - akcent */
    --accent: #10b981;         /* Zielony - dodatkowy */
    --dark: #0f172a;           /* Ciemne tło */
}
```

### Dodawanie Książek

W pliku `js/desktop.js` znajdź tablicę `books`:

```javascript
books: [
    { 
        id: 13, 
        title: 'Nowa Książka', 
        cover: '📕', 
        category: 'seeker',
        rating: 4.9, 
        author: 'Autor', 
        chapters: 10,
        premium: false 
    }
]
```

### Modyfikacja Zespołu

W pliku `index.html` znajdź sekcję `.team-grid` i dodaj/edytuj karty:

```html
<div class="team-card">
    <div class="team-avatar">👤</div>
    <h3 class="team-name">Imię Nazwisko</h3>
    <p class="team-role">Stanowisko</p>
    <p class="team-bio">Bio osoby...</p>
    <div class="team-social">
        <a href="#" class="social-link">🔗</a>
    </div>
</div>
```

### Zmiana Tekstów

Wszystkie teksty są w `index.html`. Użyj Ctrl+F aby znaleźć i zamienić:
- Tytuły sekcji
- Opisy
- Call-to-action
- Informacje kontaktowe

## 📱 Responsywność

Strona jest w pełni responsywna z breakpointami:

- **Desktop**: > 1024px (pełna funkcjonalność)
- **Tablet**: 768px - 1024px (2-kolumnowy layout)
- **Mobile**: < 768px (single column, mobile menu)

## 🌐 Integracje

### Google Analytics (gotowe do dodania)

Przed zamknięciem `</head>` w `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Mailchimp Newsletter

Zastąp formularz newslettera:

```html
<form action="https://eterniverse.us1.list-manage.com/subscribe/post" method="POST">
    <input type="hidden" name="u" value="YOUR_USER_ID">
    <input type="hidden" name="id" value="YOUR_LIST_ID">
    <input type="email" name="MERGE0" required>
    <button type="submit">Zapisz się</button>
</form>
```

### Formularz Kontaktowy z Formspree

Zmień w `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
```

## 🎯 SEO

### Meta Tagi

Już zaimplementowane w `<head>`:
- Description
- Viewport
- Charset

### Dodatkowe (zalecane):

```html
<!-- Open Graph -->
<meta property="og:title" content="Eterniverse - Wydawnictwo Transformacyjne">
<meta property="og:description" content="Odkryj światy literatury transformacyjnej">
<meta property="og:image" content="https://eterniverse.pl/og-image.jpg">
<meta property="og:url" content="https://eterniverse.pl">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Eterniverse">
<meta name="twitter:description" content="Wydawnictwo Transformacyjne">
```

## 🚀 Deploy

### GitHub Pages

1. Push do GitHub
2. Settings → Pages
3. Source: main branch
4. Save

Strona będzie dostępna pod: `https://username.github.io/eterniverse-desktop`

### Netlify

1. Przeciągnij folder na netlify.com/drop
2. LUB połącz repo GitHub
3. Deploy!

### Vercel

```bash
npm i -g vercel
vercel
```

## 📊 Analityka

Strona jest gotowa na:
- Google Analytics
- Facebook Pixel
- Hotjar
- Mixpanel

Dodaj skrypty przed `</body>` w `index.html`.

## ⚡ Optymalizacja

### Obecna wydajność:
- ✅ Brak zewnętrznych zależności (poza czcionkami)
- ✅ Minimalny JavaScript
- ✅ Czysty CSS bez frameworków
- ✅ Lazy loading gotowy do implementacji

### Dalsze usprawnienia:

1. **Minifikacja**:
```bash
npm install -g html-minifier clean-css-cli uglify-js
html-minifier index.html -o index.min.html
```

2. **Obrazy**: Dodaj lazy loading
```html
<img loading="lazy" src="image.jpg" alt="Description">
```

3. **Cache**: Dodaj Service Worker dla PWA

## 🔒 Bezpieczeństwo

- ✅ Brak wrażliwych danych w kodzie
- ✅ Formularze z zabezpieczeniem CSRF (do konfiguracji)
- ⚠️ Dodaj HTTPS w produkcji
- ⚠️ Skonfiguruj CSP headers

## 📞 Wsparcie

- 📧 Email: kontakt@eterniverse.pl
- 🌐 Website: https://eterniverse.pl
- 💬 Discord: [Link do serwera]
- 📱 Social: @eterniverse

## 🤝 Współpraca

Chcesz pomóc? Zobacz [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork repozytorium
2. Stwórz branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📝 Changelog

### v1.0.0 (2025-01-07)
- ✨ Początkowe wydanie
- 🎨 Kompletny design system
- 📚 System katalogowania książek
- 👥 Sekcja zespołu
- 📝 Blog z featured posts
- 💌 Integracja newslettera
- 📞 Formularz kontaktowy
- 🔍 Zaawansowana wyszukiwarka

## 📄 Licencja

© 2025 Eterniverse. Wszystkie prawa zastrzeżone.

---

**Stworzone z ❤️ dla społeczności Eterniverse**

*Transformuj swoją świadomość przez literaturę* ✨
