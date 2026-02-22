// Translation data
const translations = {
    en: {
        'home-page-title': 'Neighborhood Utilities',
        'nav-home': 'Home',
        'nav-calendar': 'Trash Calendar',
        'nav-contact': 'Contact',
        'home-welcome': 'Welcome',
        'home-description': 'This website provides useful utilities for neighbors, including a trash collection calendar.',
        'home-instruction': 'Use the navigation above to explore the available features.',
        'footer-text': 'Built by a neighbor'
    },
    de: {
        'home-page-title': 'Nachbarschafts-Tools',
        'nav-home': 'Startseite',
        'nav-calendar': 'Abfallkalender',
        'nav-contact': 'Kontakt',
        'home-welcome': 'Willkommen',
        'home-description': 'Diese Website bietet nützliche Tools für Nachbarn, einschließlich eines Müllabfuhrkalenders.',
        'home-instruction': 'Verwenden Sie die Navigation oben, um die verfügbaren Funktionen zu erkunden.',
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