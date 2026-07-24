# ✅ TODO - Implementación de Chatbot + Interactividad

## Fase 1: Google Sheets FAQ ✅
- [x] 1.1 Crear documentación de template de Google Sheets (`GOOGLE_SHEETS_GUIDE.md`)
- [x] 1.2 Crear Google Apps Script para publicar Sheet como API REST JSON

## Fase 2: Chatbot Widget ✅
- [x] 2.1 Crear `chat-widget.css` - Estilos del widget flotante
- [x] 2.2 Crear `chat-widget.js` - Lógica del chatbot (IIFE, auto-init)
- [x] 2.3 Crear `chat-data.js` - Datos FAQ embebidos (16 preguntas + matching semántico + Google Sheets API)

## Fase 3: Integración en páginas HTML ✅
- [x] 3.1 Integrar chatbot en `index.html` (CSS + JS)
- [x] 3.2 Integrar chatbot en `hidrocarburos.html`
- [x] 3.3 Integrar chatbot en `suministros.html`
- [x] 3.4 Integrar chatbot en `transporte.html`

## Fase 4: Características interactivas adicionales ✅
- [x] 4.1 Guía completa de conexión a Google Sheets (`GOOGLE_SHEETS_GUIDE.md`)
- [x] 4.2 Fallback: formulario de contacto dentro del chat si no encuentra respuesta
- [x] 4.3 Botones de preguntas rápidas (quick replies) contextuales
- [x] 4.4 Datos FAQ precargados para modo offline/local (USE_LOCAL_ONLY = true)

## Pendiente (cuando tengas Google Sheet)
- [ ] Publicar Google Sheet como Web App (Apps Script)
- [ ] Cambiar `USE_LOCAL_ONLY: false` en `chat-data.js`
- [ ] Pegar URL de la API en `SHEETS_API_URL`

