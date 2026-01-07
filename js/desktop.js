// ==========================================
// APP STATE
// ==========================================
const appState = {
    books: [
        { id: 1, title: 'INTERSEEKER: Geneza', cover: '📘', category: 'seeker', rating: 4.9, author: 'Maciej Maciuszek', chapters: 12 },
        { id: 2, title: 'ARCHETYP SEEKER', cover: '👑', category: 'seeker', rating: 4.8, author: 'Maciej Maciuszek', chapters: 10, premium: true },
        { id: 3, title: 'WolaSeeker', cover: '⚡', category: 'seeker', rating: 4.7, author: 'Anna Kowalska', chapters: 8 },
        { id: 4, title: 'ObfitoSeeker', cover: '💎', category: 'seeker', rating: 4.8, author: 'Maciej Maciuszek', chapters: 11 },
        { id: 5, title: 'Cosmic Journey', cover: '🌌', category: 'philosophy', rating: 4.6, author: 'Piotr Nowak', chapters: 15 },
        { id: 6, title: 'Soul Navigator', cover: '🧭', category: 'transformation', rating: 4.9, author: 'Anna Kowalska', chapters: 9, premium: true },
        { id: 7, title: 'Mind Explorer', cover: '🧠', category: 'philosophy', rating: 4.7, author: 'Maciej Maciuszek', chapters: 14 },
        { id: 8, title: 'Inner Compass', cover: '🎯', category: 'transformation', rating: 4.8, author: 'Anna Kowalska', chapters: 10 },
        { id: 9, title: 'Quantum Seeker', cover: '⚛️', category: 'seeker', rating: 4.9, author: 'Piotr Nowak', chapters: 13, premium: true },
        { id: 10, title: 'Light Bearer', cover: '💡', category: 'transformation', rating: 4.6, author: 'Maria Wiśniewska', chapters: 7 },
        { id: 11, title: 'Deep Dive', cover: '🌊', category: 'philosophy', rating: 4.7, author: 'Maciej Maciuszek', chapters: 12 },
        { id: 12, title: 'Star Seeker', cover: '⭐', category: 'seeker', rating: 4.8, author: 'Anna Kowalska', chapters: 11 }
    ],
    currentFilter: 'all'
};

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSearch();
    initCatalog();
    initScrollEffects();
    initBackToTop();
    initForms();
});

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// ==========================================
// SEARCH
// ==========================================
function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // Close on overlay click
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // Search suggestions
    const suggestions = document.querySelectorAll('.search-suggestion');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            searchInput.value = this.textContent;
            // Implement actual search here
            console.log('Searching for:', this.textContent);
        });
    });
}

// ==========================================
// CATALOG
// ==========================================
function initCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Render initial books
    renderBooks();
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            appState.currentFilter = filter;
            renderBooks();
        });
    });
}

function renderBooks() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = '';
    
    let filteredBooks = appState.books;
    
    if (appState.currentFilter !== 'all') {
        if (appState.currentFilter === 'premium') {
            filteredBooks = appState.books.filter(book => book.premium);
        } else {
            filteredBooks = appState.books.filter(book => book.category === appState.currentFilter);
        }
    }
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        catalogGrid.appendChild(bookCard);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'catalog-book';
    
    card.innerHTML = `
        <div class="catalog-book-cover">
            ${book.cover}
            ${book.premium ? '<span class="premium-badge">PREMIUM</span>' : ''}
        </div>
        <div class="catalog-book-info">
            <h3 class="catalog-book-title">${book.title}</h3>
            <p class="catalog-book-author">${book.author}</p>
            <div class="catalog-book-rating">
                <span>⭐ ${book.rating}</span>
                <span>•</span>
                <span>${book.chapters} rozdziałów</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', function() {
        showBookDetails(book);
    });
    
    return card;
}

function showBookDetails(book) {
    alert(`Szczegóły książki: ${book.title}\nAutor: ${book.author}\nOcena: ${book.rating}⭐\nRozdziały: ${book.chapters}`);
    // Tutaj możesz dodać modal z pełnymi szczegółami książki
}

// ==========================================
// SCROLL EFFECTS
// ==========================================
function initScrollEffects() {
    // Reveal on scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ==========================================
// BACK TO TOP
// ==========================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// FORMS
// ==========================================
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter signup:', email);
            alert('Dziękujemy za zapisanie się do newslettera! ✨');
            this.reset();
        });
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            console.log('Contact form submission:', data);
            alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe. 💌');
            this.reset();
        });
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Parallax effect for hero
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        const heroVisual = hero.querySelector('.hero-visual');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - scrolled / 700;
        }
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Animate floating books
const floatingBooks = document.querySelectorAll('.floating-book');
floatingBooks.forEach((book, index) => {
    book.style.animationDelay = `${index * 2}s`;
});

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message
console.log('%cWitaj w Eterniverse! ✨', 'font-size: 24px; color: #3b82f6; font-weight: bold;');
console.log('%cJeśli jesteś developerem i chcesz dołączyć do naszego zespołu, skontaktuj się z nami!', 'font-size: 14px; color: #8b5cf6;');

// Export for potential use in other modules
window.eterniverseApp = {
    state: appState,
    renderBooks,
    showBookDetails
};
