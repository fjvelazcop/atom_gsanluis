# TODO - Auto-reinicio + recarga automática en desarrollo

- [x] Revisar cómo se inicia el servidor en `app/frontend` (scripts de `package.json`).
- [x] Configurar recarga automática del navegador para ver cambios al guardar (Vite + HMR).
- [x] Ajustar Service Worker para evitar caché agresiva en desarrollo.
- [x] Documentar comandos de inicio y uso.

## Comandos
- cd app/frontend
- pnpm install
- pnpm run dev

## Qué esperar
- Al guardar cambios en `index.html`, `style.css` o `script.js`, Vite refresca automáticamente en el navegador (HMR/Reload).
- En `localhost` el Service Worker no cachea para que los cambios se vean inmediatos.



