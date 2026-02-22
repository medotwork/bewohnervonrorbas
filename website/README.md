# Neighborhood Utilities Website

A simple website providing utilities for neighbors, including an event calendar with ICS file support.

## Project Structure

```
website/
├── src/
│   ├── index.html         # Home page
│   ├── calendar.html      # Calendar page with event listing
│   ├── css/
│   │   └── styles.css     # Forest green themed styles
│   ├── js/
│   │   ├── main.js        # Main JavaScript functionality
│   │   └── calendar.js    # Calendar parsing and display logic
│   └── assets/
├── public/
│   └── calendar.ics       # ICS calendar file
├── serve.sh               # Local development server script
└── README.md
```

## Features

### Calendar Page
- **Upcoming Events Display**: Shows only today's and future events
- **Smart Date Formatting**: Human-readable dates with relative time (e.g., "in 5 days", "Tomorrow")
- **Pagination**: Dynamically adjusts number of events per page based on viewport/zoom
- **Responsive Layout**: No scrolling needed - events fit perfectly on screen
- **Download Option**: Download full calendar as ICS file
- **UTC Time Support**: Correctly handles both UTC and local time formats
- **All-Day Events**: Properly displays whole-day events without time

### Design
- Forest green color theme
- Modern card-based layout with hover effects
- Glassmorphism effects on headers and sections
- Smooth transitions and animations

## Setup Instructions

1. Navigate to the project directory:
   ```bash
   cd /home/jlcb/repos/bewohnervrorbas/website
   ```

2. Start the local development server:
   ```bash
   ./serve.sh
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000/src/index.html
   http://localhost:8000/src/calendar.html
   ```

## Calendar File Format

The `public/calendar.ics` file supports standard ICS format with:
- `DTSTART`: Event start date/time (supports both `VALUE=DATE` for all-day events and UTC timestamps)
- `SUMMARY`: Event title
- `DESCRIPTION`: Event description
- `CATEGORIES`: Event categories

## Technical Details

### Date Handling
- Filters events to show only today and future dates
- Converts UTC times to local timezone
- Handles both all-day events (`DTSTART;VALUE=DATE`) and timed events
- Compares dates at midnight for consistent filtering

### Dynamic Pagination
- Calculates events per page based on viewport height
- Adjusts automatically on window resize/zoom
- Ensures all events are fully visible without cutting off

### Browser Compatibility
- Works in all modern browsers
- Uses standard JavaScript (no external dependencies)
- Responsive design adapts to different screen sizes

## Development

The website uses vanilla HTML, CSS, and JavaScript with no build process required. Simply edit the files and refresh your browser.

To update the calendar, replace or modify the `public/calendar.ics` file.