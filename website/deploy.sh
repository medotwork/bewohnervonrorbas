#!/bin/bash

# Cloudflare Pages Deployment Script
# This script deploys the website to Cloudflare Pages

set -e  # Exit on any error

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

# Check if required variables are set
if [ -z "$CLOUDFLARE_PROJECT_NAME" ]; then
    echo "❌ Error: CLOUDFLARE_PROJECT_NAME is not set in .env"
    exit 1
fi

echo "🚀 Starting Cloudflare Pages deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler is not installed. Installing...${NC}"
    npm install -g wrangler
fi

# Check if user is logged in to Cloudflare
echo -e "${YELLOW}🔐 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Cloudflare${NC}"
    echo -e "${YELLOW}Please run: wrangler login${NC}"
    exit 1
fi

# Validate that src directory exists
if [ ! -d "src" ]; then
    echo -e "${RED}❌ Error: src directory not found${NC}"
    exit 1
fi

# Deploy to Cloudflare Pages
echo -e "${YELLOW}☁️  Deploying to Cloudflare Pages...${NC}"
echo -e "${YELLOW}📦 Project: $CLOUDFLARE_PROJECT_NAME${NC}"

# Check if this is a preview deployment
if [ "$1" = "preview" ]; then
    echo -e "${YELLOW}🔄 Deploying preview branch...${NC}"
    wrangler pages deploy src --project-name="$CLOUDFLARE_PROJECT_NAME" --branch=preview
else
    wrangler pages deploy src --project-name="$CLOUDFLARE_PROJECT_NAME"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your website is now live on Cloudflare Pages${NC}"
echo ""
echo "Useful commands:"
echo "  wrangler pages deployment list --project-name=$CLOUDFLARE_PROJECT_NAME    # View deployments"
echo "  npm run preview                                                         # Deploy preview branch"
