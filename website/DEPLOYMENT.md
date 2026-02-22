# Cloudflare Pages Deployment Guide

This guide explains how to deploy the website to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js**: Version 16.13.0 or higher
3. **Wrangler CLI**: Cloudflare's command-line tool

## Initial Setup

### 1. Install Wrangler (if not already installed)

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Install Project Dependencies

```bash
cd website
npm install
```

## Deployment

### Quick Deploy

Use the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy

```bash
npm run deploy
```

Or directly with wrangler:

```bash
wrangler pages deploy src --project-name=bewohnervonrorbas
```

### Preview Deployment

Deploy a preview version:

```bash
npm run preview
```

## Local Development

Test your website locally with a simple HTTP server:

```bash
cd src
python -m http.server 8000
# or
npx serve .
```

## Configuration

### Update Project Name

Update the project name in deploy commands:

```bash
wrangler pages deploy src --project-name=your-project-name
```

Or edit the `deploy` script in `package.json`

### Add Custom Domain

After deployment, add a custom domain in the Cloudflare dashboard:

1. Go to Pages project settings
2. Navigate to "Custom domains"
3. Add your domain
4. Update DNS records as instructed

### Environment Variables

Add environment variables in the Cloudflare dashboard:

1. Go to Pages project settings
2. Navigate to "Environment variables"
3. Add variables for production/preview environments

## Useful Commands

- **Deploy**: `npm run deploy` or `wrangler pages deploy src --project-name=bewohnervonrorbas`
- **Preview deploy**: `npm run preview`
- **List deployments**: `wrangler pages deployment list --project-name=bewohnervonrorbas`
- **Check status**: `wrangler whoami`
- **View project**: Visit Cloudflare dashboard → Pages

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
wrangler logout
wrangler login
```

### Build Errors

Ensure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Deployment Not Updating

Clear browser cache or use incognito mode. Cloudflare Pages automatically handles cache invalidation.

## Cost

Cloudflare Pages Free Plan includes:
- Unlimited static requests
- Unlimited bandwidth
- 500 builds per month
- 1 build at a time

For higher traffic and more features, upgrade to the Pages Paid plan ($20/month) which includes:
- 5,000 builds per month
- 5 concurrent builds
- Advanced features

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)
