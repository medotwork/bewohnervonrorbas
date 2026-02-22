#!/bin/bash

echo "Starting local web server..."
echo "Open http://localhost:8000/src/ in your browser"
echo "Press Ctrl+C to stop the server"

cd "/home/jlcb/repos/bewohnervrorbas/website"
python3 -m http.server 8000
