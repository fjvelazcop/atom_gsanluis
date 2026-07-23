// ============================================
// Grupo San Luis - Local Development API Server
// ============================================
// Run with: node api/dev-server.js
// This emulates the Vercel serverless function locally
// Vite proxies /api/* requests to this server

const http = require('http');
const { handleContact } = require('./contact');

const PORT = process.env.API_PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only handle POST /api/contact
  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch {
        req.body = {};
      }

      // Create Express-like request/response objects for the handler
      const expressRes = {
        status(code) {
          res.statusCode = code;
          return this;
        },
        json(data) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        },
        end() {
          res.end();
        },
        setHeader: (key, val) => res.setHeader(key, val)
      };

      // In dev mode, load .env file if available
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(__dirname, '..', 'app', '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          envContent.split('\n').forEach(line => {
            const [key, ...vals] = line.split('=');
            if (key && vals.length) {
              const cleanKey = key.trim();
              const cleanVal = vals.join('=').trim().replace(/['"]/g, '');
              if (cleanKey && !process.env[cleanKey]) {
                process.env[cleanKey] = cleanVal;
              }
            }
          });
        }
      } catch (e) {
        // .env file is optional
      }

      await handleContact(req, expressRes);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`[API Dev Server] Running on http://localhost:${PORT}`);
  console.log(`[API Dev Server] POST /api/contact`);
});

