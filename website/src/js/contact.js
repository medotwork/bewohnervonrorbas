// Translation data
const translations = {
    en: {
        'contact-page-title': 'Contact',
        'nav-home': 'Home',
        'nav-calendar': 'Trash Calendar',
        'nav-contact': 'Contact',
        'contact-heading': 'Get in Touch',
        'contact-intro': 'Have questions, suggestions, or found an issue? Feel free to reach out!',
        'contact-method-title': 'Contact Methods',
        'contact-email-label': 'Email:',
        'contact-github-label': 'GitHub Issues:',
        'contact-github-link': 'Report an issue',
        'contact-note': 'This website is maintained by a neighbor as a community service. Response times may vary.',
        'footer-text': 'Built by a neighbor'
    },
    de: {
        'contact-page-title': 'Kontakt',
        'nav-home': 'Startseite',
        'nav-calendar': 'Abfallkalender',
        'nav-contact': 'Kontakt',
        'contact-heading': 'Kontaktieren Sie uns',
        'contact-intro': 'Haben Sie Fragen, Vorschläge oder ein Problem gefunden? Melden Sie sich gerne!',
        'contact-method-title': 'Kontaktmöglichkeiten',
        'contact-email-label': 'E-Mail:',
        'contact-github-label': 'GitHub Issues:',
        'contact-github-link': 'Problem melden',
        'contact-note': 'Diese Website wird von einem Nachbarn als Community-Service betrieben. Die Antwortzeiten können variieren.',
        'footer-text': 'Erstellt von einem Nachbarn'
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

// Function to translate the page
function translatePage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', (e) => {
            translatePage(e.target.value);
        });
    }
    
    // Apply initial translation
    translatePage(currentLanguage);
});
