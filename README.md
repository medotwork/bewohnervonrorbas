# Bewohner von Rorbas

A neighborhood utilities website providing trash collection calendar and community information for Rorbas residents.

## Features

- 📅 **Interactive Trash Calendar** - View upcoming trash collection days with category filtering
- 🌍 **Multilingual Support** - Available in English and German
- 📱 **Mobile Responsive** - Optimized for all devices
- 📥 **ICS Export** - Download or subscribe to calendar in any calendar app
- 🔍 **Smart Filtering** - Filter by category and date range
- 📄 **Pagination** - Easy navigation through events

## Project Structure

```
├── app/                    # Python calendar generation
│   ├── cli/
│   │   └── generate.py    # Script to generate ICS from JSON
│   ├── calendars/
│   │   ├── json/          # JSON calendar data
│   │   └── ics/           # Generated ICS files
│   └── requirements.txt
│
└── website/               # Static website
    ├── src/
    │   ├── assets/        # Calendar ICS files
    │   ├── css/          # Stylesheets
    │   ├── js/           # JavaScript files
    │   ├── *.html        # HTML pages
    │   └── ...
    ├── deploy.sh         # Cloudflare deployment script
    ├── wrangler.toml     # Cloudflare Workers config
    ├── worker.js         # Cloudflare Worker script
    └── package.json      # NPM dependencies
```

## Setup

### Prerequisites

- Python 3.x (for calendar generation)
- Node.js 16+ (for website deployment)
- Wrangler CLI (for Cloudflare Workers)

### Calendar Generation

1. **Install Python dependencies:**
   ```bash
   cd app
   pip install -r requirements.txt
   ```

2. **Generate ICS calendar from JSON:**
   ```bash
   python cli/generate.py
   ```

   This converts JSON calendar data to ICS format.

### Website Development

1. **Local testing:**
   ```bash
   cd website
   ./serve.sh
   ```

   This starts a local web server to test the website.

## Deployment

The website is deployed to **Cloudflare Pages** for global distribution and performance.

### Initial Setup

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   # or locally in the website directory:
   cd website
   npm i -D wrangler@latest
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

### Deploy to Cloudflare Pages

**First time setup:**

1. **Create environment file:**
   ```bash
   cd website
   cp .env.example .env
   ```

2. **Edit `.env` and add your Cloudflare Pages project name:**
   ```bash
   CLOUDFLARE_PROJECT_NAME=your-project-name
   ```

**Deploy:**

**Quick deploy:**
```bash
cd website
./deploy.sh
```

**Or manually:**
```bash
cd website
npm run deploy
```

**Preview deployment:**
```bash
npm run preview
```

### Configuration

- **Project name**: Update in `deploy.sh` and `package.json` scripts
- **Custom domain**: Configure in Cloudflare dashboard under Pages project settings
- **Headers & redirects**: Edit [website/src/_headers](website/src/_headers) and [website/src/_redirects](website/src/_redirects)

For detailed deployment instructions, see [website/DEPLOYMENT.md](website/DEPLOYMENT.md)

## Development Workflow

1. **Update calendar data** in `app/calendars/json/`
2. **Regenerate ICS files** with `python app/cli/generate.py`
3. **Copy ICS to website** (if needed): `cp app/calendars/ics/*.ics website/src/assets/`
4. **Test locally** with `cd website && npm run dev`
5. **Deploy** with `cd website && npm run deploy`

## Technologies

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Hosting**: Cloudflare Pages
- **Calendar**: Python with icalendar library
- **Languages**: English, German (i18n)

## Author

Built by medotwork - A neighbor making life easier for the community

## License

MIT