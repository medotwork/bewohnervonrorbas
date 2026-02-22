// This file is responsible for parsing the ICS file and displaying the calendar events on the calendar page. 
// It includes functions to read the ICS file and render the events in a user-friendly format.

// Translation data
const translations = {
    en: {
        'page-title': 'Trash Collection Calendar',
        'nav-home': 'Home',
        'nav-calendar': 'Trash Calendar',
        'nav-contact': 'Contact',
        'upcoming-events': 'Upcoming Trash Days',
        'loading-calendar': 'Loading calendar...',
        'download-title': 'Download Calendar',
        'download-description': 'Subscribe to or download the full calendar with all events',
        'download-button': 'Download ICS File',
        'download-filtered-button': 'Download Filtered Events',
        'notice-title': '⚠️ Notice',
        'notice-text': 'This is not an official website of the Comune. The information displayed here may not contain the most recent updates.',
        'notice-link-text': 'For the most up-to-date information, please visit:',
        'footer-text': 'Built by a neighbor',
        'no-events': 'No events found.',
        'previous': '← Previous',
        'next': 'Next →',
        'page-info': 'Page {current} of {total}',
        'today': 'Today',
        'tomorrow': 'Tomorrow',
        'in-days': 'in {days} days',
        'days-ago': '{days} days ago',
        'filter-label': 'Filter by category:',
        'filter-all': 'All Categories',
        'filter-next-7-days': 'Next 7 Days Only'
    },
    de: {
        'page-title': 'Abfallkalender',
        'nav-home': 'Startseite',
        'nav-calendar': 'Abfallkalender',
        'nav-contact': 'Kontakt',
        'upcoming-events': 'Kommende Müllabfuhrtage',
        'loading-calendar': 'Kalender wird geladen...',
        'download-title': 'Kalender herunterladen',
        'download-description': 'Abonnieren oder laden Sie den vollständigen Kalender mit allen Terminen herunter',
        'download-button': 'ICS-Datei herunterladen',
        'download-filtered-button': 'Gefilterte Termine herunterladen',
        'notice-title': '⚠️ Hinweis',
        'notice-text': 'Dies ist keine offizielle Website der Gemeinde. Die hier angezeigten Informationen enthalten möglicherweise nicht die neuesten Aktualisierungen.',
        'notice-link-text': 'Für die aktuellsten Informationen besuchen Sie bitte:',
        'footer-text': 'Erstellt von einem Nachbarn',
        'no-events': 'Keine Termine gefunden.',
        'previous': '← Zurück',
        'next': 'Weiter →',
        'page-info': 'Seite {current} von {total}',
        'today': 'Heute',
        'tomorrow': 'Morgen',
        'in-days': 'in {days} Tagen',
        'days-ago': 'vor {days} Tagen',
        'filter-label': 'Nach Kategorie filtern:',
        'filter-all': 'Alle Kategorien',
        'filter-next-7-days': 'Nur nächste 7 Tage'
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';
let allEvents = [];
let filteredEvents = [];
let currentPage = 1;
let eventsPerPage = 5;
let selectedCategories = new Set();
let next7DaysOnly = false;
let calendarContainer;

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
    
    // Refresh calendar display to update dynamic content
    if (allEvents && allEvents.length > 0 && calendarContainer) {
        displayEvents(currentPage);
    }
}

// Function to get translated text
function t(key, replacements = {}) {
    let text = translations[currentLanguage][key] || key;
    Object.keys(replacements).forEach(replaceKey => {
        text = text.replace(`{${replaceKey}}`, replacements[replaceKey]);
    });
    return text;
}

document.addEventListener('DOMContentLoaded', function() {
    calendarContainer = document.getElementById('calendar-container');
    eventsPerPage = calculateEventsPerPage();
    
    // Initialize language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', (e) => {
            translatePage(e.target.value);
        });
    }
    
    // Initialize next 7 days filter
    const next7DaysCheckbox = document.getElementById('next-7-days-filter');
    if (next7DaysCheckbox) {
        next7DaysCheckbox.addEventListener('change', (e) => {
            next7DaysOnly = e.target.checked;
            currentPage = 1;
            applyFilters();
            displayEvents(currentPage);
        });
    }
    
    // Initialize filtered download button
    const downloadFilteredBtn = document.getElementById('download-filtered-btn');
    if (downloadFilteredBtn) {
        downloadFilteredBtn.addEventListener('click', () => {
            downloadFilteredICS();
        });
    }
    
    // Apply initial translation
    translatePage(currentLanguage);

    // Recalculate events per page on window resize/zoom
    window.addEventListener('resize', () => {
        const newEventsPerPage = calculateEventsPerPage();
        if (newEventsPerPage !== eventsPerPage) {
            eventsPerPage = newEventsPerPage;
            currentPage = 1; // Reset to first page
            displayEvents(currentPage);
        }
    });

    function calculateEventsPerPage() {
        // Calculate based on actual available space
        const viewportHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;
        
        // On mobile, show more events since we now have scrolling
        if (isMobile) {
            return 10; // Show 10 events per page on mobile
        }
        
        // Get actual heights of elements if they exist
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const section = document.querySelector('section');
        const sectionH2 = document.querySelector('section h2');
        
        const headerHeight = header ? header.offsetHeight : 100;
        const footerHeight = footer ? footer.offsetHeight : 60;
        const mainMargin = 40; // 20px top + 20px bottom
        const sectionPadding = 80; // 40px top + 40px bottom
        const sectionH2Height = sectionH2 ? sectionH2.offsetHeight + 30 : 70; // h2 + margin-bottom
        const paginationHeight = 120; // Pagination controls height + padding
        
        const availableHeight = viewportHeight - headerHeight - footerHeight - mainMargin - sectionPadding - sectionH2Height - paginationHeight;
        const eventHeight = 200; // More conservative estimate to prevent cutoff
        const bufferSpace = 40; // Extra buffer to ensure no cutoff
        
        const calculatedEvents = Math.floor((availableHeight - bufferSpace) / eventHeight);
        
        // Ensure at least 1 event, maximum 20
        return Math.max(1, Math.min(20, calculatedEvents));
    }

    fetch('assets/calendar.ics')
        .then(response => response.text())
        .then(data => {
            allEvents = parseICS(data);
            allEvents = sortEventsByDate(allEvents);
            allEvents = filterFutureEvents(allEvents);
            populateCategoryFilter();
            applyFilters();
            displayEvents(currentPage);
        })
        .catch(error => {
            console.error('Error fetching the ICS file:', error);
            calendarContainer.innerHTML = `<p style="color: red;">Error loading calendar: ${error.message}. Please make sure the server is running and the calendar.ics file exists.</p>`;
        });

    function populateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;
        
        // Extract all unique categories from events
        const categories = new Set();
        allEvents.forEach(event => {
            if (event.CATEGORIES && Array.isArray(event.CATEGORIES)) {
                event.CATEGORIES.forEach(cat => categories.add(cat));
            }
        });
        
        // Clear existing checkboxes
        categoryFilter.innerHTML = '';
        
        // Add "All" checkbox
        const allLabel = document.createElement('label');
        allLabel.className = 'category-checkbox-label';
        const allCheckbox = document.createElement('input');
        allCheckbox.type = 'checkbox';
        allCheckbox.value = 'all';
        allCheckbox.checked = true;
        allCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedCategories.clear();
                // Uncheck all other checkboxes
                categoryFilter.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            }
            currentPage = 1;
            applyFilters();
            displayEvents(currentPage);
        });
        const allText = document.createElement('span');
        allText.setAttribute('data-i18n', 'filter-all');
        allText.textContent = t('filter-all');
        allLabel.appendChild(allCheckbox);
        allLabel.appendChild(allText);
        categoryFilter.appendChild(allLabel);
        
        // Add category checkboxes
        Array.from(categories).sort().forEach(category => {
            const label = document.createElement('label');
            label.className = 'category-checkbox-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.addEventListener('change', (e) => {
                const allCheckbox = categoryFilter.querySelector('input[value="all"]');
                if (e.target.checked) {
                    selectedCategories.add(category);
                    allCheckbox.checked = false;
                } else {
                    selectedCategories.delete(category);
                    if (selectedCategories.size === 0) {
                        allCheckbox.checked = true;
                    }
                }
                currentPage = 1;
                applyFilters();
                displayEvents(currentPage);
            });
            const text = document.createElement('span');
            text.textContent = category;
            label.appendChild(checkbox);
            label.appendChild(text);
            categoryFilter.appendChild(label);
        });
    }
    
    function applyFilters() {
        filteredEvents = allEvents.filter(event => {
            // Category filter
            let categoryMatch = true;
            if (selectedCategories.size > 0) {
                if (!event.CATEGORIES || !Array.isArray(event.CATEGORIES)) {
                    categoryMatch = false;
                } else {
                    categoryMatch = event.CATEGORIES.some(cat => selectedCategories.has(cat));
                }
            }
            
            // Date range filter (next 7 days)
            let dateMatch = true;
            if (next7DaysOnly) {
                const eventDate = parseICSDateToObject(event['DTSTART']);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sevenDaysFromNow = new Date(today);
                sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
                eventDate.setHours(0, 0, 0, 0);
                
                dateMatch = eventDate >= today && eventDate <= sevenDaysFromNow;
            }
            
            return categoryMatch && dateMatch;
        });
    }

    function generateICS(events) {
        let icsContent = 'BEGIN:VCALENDAR\r\n';
        icsContent += 'VERSION:2.0\r\n';
        icsContent += 'PRODID:-//Neighborhood Calendar//EN\r\n';
        
        events.forEach(event => {
            icsContent += 'BEGIN:VEVENT\r\n';
            
            if (event.DTSTART) {
                if (event.IS_ALL_DAY) {
                    icsContent += `DTSTART;VALUE=DATE:${event.DTSTART}\r\n`;
                } else {
                    icsContent += `DTSTART:${event.DTSTART}\r\n`;
                }
            }
            
            if (event.DTEND) {
                icsContent += `DTEND:${event.DTEND}\r\n`;
            }
            
            if (event.SUMMARY) {
                icsContent += `SUMMARY:${event.SUMMARY}\r\n`;
            }
            
            if (event.DESCRIPTION) {
                icsContent += `DESCRIPTION:${event.DESCRIPTION}\r\n`;
            }
            
            if (event.CATEGORIES && Array.isArray(event.CATEGORIES)) {
                icsContent += `CATEGORIES:${event.CATEGORIES.join(',')}\r\n`;
            }
            
            if (event.UID) {
                icsContent += `UID:${event.UID}\r\n`;
            }
            
            icsContent += 'END:VEVENT\r\n';
        });
        
        icsContent += 'END:VCALENDAR\r\n';
        return icsContent;
    }

    function downloadFilteredICS() {
        if (filteredEvents.length === 0) {
            alert('No events to download. Please adjust your filters.');
            return;
        }
        
        const icsContent = generateICS(filteredEvents);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'filtered_calendar.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    function parseICS(data) {
        const events = [];
        const lines = data.split('\n');
        let event = {};
        let inEvent = false;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('BEGIN:VEVENT')) {
                inEvent = true;
                event = {};
            } else if (line.startsWith('END:VEVENT')) {
                inEvent = false;
                events.push(event);
            } else if (inEvent) {
                if (line.startsWith('DTSTART')) {
                    // Handle DTSTART;VALUE=DATE:20260222 or DTSTART:20260220T110000Z
                    const parts = line.split(':');
                    const dateValue = parts[parts.length - 1];
                    event['DTSTART'] = dateValue;
                    // Check if it's a whole day event
                    event['IS_ALL_DAY'] = line.includes('VALUE=DATE');
                } else if (line.startsWith('CATEGORIES')) {
                    const [key, ...value] = line.split(':');
                    // Parse comma-separated categories
                    event[key] = value.join(':').split(',').map(cat => cat.trim());
                } else {
                    const [key, ...value] = line.split(':');
                    event[key] = value.join(':');
                }
            }
        });

        return events;
    }

    function formatICSDate(icsDate, isAllDay) {
        if (!icsDate) return 'No Date';
        
        // Remove 'Z' if present (UTC indicator)
        icsDate = icsDate.replace('Z', '');
        
        // ICS format: YYYYMMDD or YYYYMMDDTHHMMSS
        const year = parseInt(icsDate.substring(0, 4));
        const month = parseInt(icsDate.substring(4, 6));
        const day = parseInt(icsDate.substring(6, 8));
        
        // For all-day events, construct date at noon to avoid timezone issues
        const date = isAllDay ? new Date(year, month - 1, day, 12, 0, 0) : new Date(year, month - 1, day);
        
        // If it's an all-day event, only show the date
        if (isAllDay) {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Check if time is included
        if (icsDate.includes('T')) {
            const hours = icsDate.substring(9, 11);
            const minutes = icsDate.substring(11, 13);
            date.setHours(hours, minutes);
            
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function parseICSDateToObject(icsDate) {
        if (!icsDate) return new Date(0);
        
        // Check if it's a UTC time (has Z)
        const isUTC = icsDate.includes('Z');
        // Remove 'Z' if present (UTC indicator)
        icsDate = icsDate.replace('Z', '');
        
        const year = parseInt(icsDate.substring(0, 4));
        const month = parseInt(icsDate.substring(4, 6));
        const day = parseInt(icsDate.substring(6, 8));
        
        let date;
        
        if (icsDate.includes('T')) {
            const hours = parseInt(icsDate.substring(9, 11));
            const minutes = parseInt(icsDate.substring(11, 13));
            
            if (isUTC) {
                // Parse as UTC and convert to local time
                date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
            } else {
                // Parse as local time
                date = new Date(year, month - 1, day, hours, minutes);
            }
        } else {
            // Date only, no time - set to noon to avoid timezone issues
            date = new Date(year, month - 1, day, 12, 0, 0);
        }
        
        return date;
    }

    function sortEventsByDate(events) {
        return events.sort((a, b) => {
            const dateA = parseICSDateToObject(a['DTSTART']);
            const dateB = parseICSDateToObject(b['DTSTART']);
            return dateA - dateB;
        });
    }

    function filterFutureEvents(events) {
        const today = new Date();
        // Set today to start of day (midnight)
        today.setHours(0, 0, 0, 0);
        
        return events.filter(event => {
            const eventDate = parseICSDateToObject(event['DTSTART']);
            // Set event date to start of day for comparison
            // This ensures all events on today's date are included, regardless of time
            eventDate.setHours(0, 0, 0, 0);
            
            // Include events from today onwards (events on or after today's date)
            // This will include past events that happened earlier today
            return eventDate.getTime() >= today.getTime();
        });
    }

    function getDaysUntil(icsDate) {
        const eventDate = parseICSDateToObject(icsDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return t('days-ago', { days: Math.abs(diffDays) });
        } else if (diffDays === 0) {
            return t('today');
        } else if (diffDays === 1) {
            return t('tomorrow');
        } else {
            return t('in-days', { days: diffDays });
        }
    }

    function displayEvents(page) {
        calendarContainer.innerHTML = '';
        
        if (filteredEvents.length === 0) {
            calendarContainer.innerHTML = `<p>${t('no-events')}</p>`;
            return;
        }

        // Create wrapper for events
        const eventsWrapper = document.createElement('div');
        eventsWrapper.classList.add('events-wrapper');

        const startIndex = (page - 1) * eventsPerPage;
        const endIndex = startIndex + eventsPerPage;
        const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

        eventsToDisplay.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');

            const title = document.createElement('h3');
            title.textContent = event['SUMMARY'] || 'No Title';
            eventElement.appendChild(title);

            const date = document.createElement('p');
            const daysUntil = getDaysUntil(event['DTSTART']);
            date.textContent = `${formatICSDate(event['DTSTART'], event['IS_ALL_DAY'])} (${daysUntil})`;
            date.style.fontWeight = '500';
            eventElement.appendChild(date);

            if (event['DESCRIPTION']) {
                const description = document.createElement('p');
                description.textContent = event['DESCRIPTION'];
                description.classList.add('event-description');
                eventElement.appendChild(description);
            }

            eventsWrapper.appendChild(eventElement);
        });

        calendarContainer.appendChild(eventsWrapper);
        createPagination(page);
    }

    function createPagination(page) {
        const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
        
        if (totalPages <= 1) return;

        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = t('previous');
        prevButton.classList.add('pagination-btn');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (page > 1) {
                currentPage = page - 1;
                displayEvents(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = t('page-info', { current: page, total: totalPages });
        paginationContainer.appendChild(pageInfo);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = t('next');
        nextButton.classList.add('pagination-btn');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (page < totalPages) {
                currentPage = page + 1;
                displayEvents(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);

        calendarContainer.appendChild(paginationContainer);
    }
});