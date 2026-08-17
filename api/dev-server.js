// ============================================
// Grupo San Luis - Local Development API Server
// ============================================
// Run with: node api/dev-server.js
// This emulates the Vercel serverless function locally
// Vite proxies /api/* requests to this server

const http = require('http');
const contactHandler = require('./contact');

const PORT = Number(process.argv[2] || process.env.API_PORT || 3002);

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

      // In dev mode, load .env files if available
      try {
        const fs = require('fs');
        const path = require('path');
        const envPaths = [
          path.join(__dirname, '..', '.env'),
          path.join(__dirname, '..', '.env.local'),
          path.join(__dirname, '..', 'app', '.env'),
          path.join(__dirname, '..', 'app', '.env.local')
        ];

        envPaths.forEach((envPath) => {
          if (!fs.existsSync(envPath)) return;

          const envContent = fs.readFileSync(envPath, 'utf-8');
          envContent.split('\n').forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) return;

            const separatorIndex = trimmedLine.indexOf('=');
            if (separatorIndex === -1) return;

            const key = trimmedLine.slice(0, separatorIndex).trim();
            const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

            if (key && !Object.prototype.hasOwnProperty.call(process.env, key)) {
              process.env[key] = value;
            }
          });
        });
      } catch (e) {
        // .env file is optional
      }

      await contactHandler(req, expressRes);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[API Dev Server] Puerto ${PORT} ya está en uso. Cierra la instancia anterior o ajusta API_PORT.`);
    process.exit(1);
  }

  throw error;
});

server.listen(PORT, () => {
  console.log(`[API Dev Server] Running on http://localhost:${PORT}`);
  console.log(`[API Dev Server] POST /api/contact`);
});

