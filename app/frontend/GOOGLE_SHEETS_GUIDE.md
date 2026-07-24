# Guía: Conectar Chatbot a Google Sheets

## Opción 1: Google Apps Script (Recomendada - Gratis)

### Paso 1: Crear el Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com) y crea un nuevo documento
2. Nómbralo: **"FAQ Grupo San Luis - Chatbot"**
3. Crea las siguientes columnas en la primera fila:

   | pregunta | respuesta | categoria | palabras_clave |
   |----------|-----------|-----------|----------------|
   | ¿Qué tipos de combustibles distribuyen? | Distribuimos gasolina, diésel... | Hidrocarburos | hidrocarburo, combustible, gasolina, diésel |
   | ¿Cómo puedo contactarlos? | Puedes contactarnos vía email... | General | contacto, teléfono, email, dirección |

4. Llena las filas con tus preguntas y respuestas
5. Copia el **ID del Sheet** de la URL: `https://docs.google.com/spreadsheets/d/`**`AQUÍ_VA_EL_ID`**`/edit`

### Paso 2: Crear el Apps Script

1. En tu Google Sheet, ve a **Extensiones → Apps Script**
2. Nombra el proyecto: "FAQ Chatbot API"
3. Copia y pega este código:

```javascript
// Google Apps Script - FAQ Chatbot API
// Publica datos de Google Sheets como JSON

function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const json = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].toLowerCase().replace(/[\s]+/g, '_')] = data[i][j];
        
        // Mapear nombres de columnas
        if (headers[j].toLowerCase() === 'pregunta') row.question = data[i][j];
        if (headers[j].toLowerCase() === 'respuesta') row.answer = data[i][j];
        if (headers[j].toLowerCase() === 'palabras_clave' || headers[j].toLowerCase() === 'palabras clave') {
          row.keywords = data[i][j];
        }
        if (headers[j].toLowerCase() === 'categoria') row.category = data[i][j];
      }
      json.push(row);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Haz clic en **Guardar** (💾)
5. Haz clic en **Implementar → Nueva implementación**
6. Selecciona **Tipo: Web App**
7. Configura:
   - **Ejecutar como**: "Yo"
   - **Quién puede acceder**: "Cualquier persona"
8. Haz clic en **Implementar**
9. **Copia la URL de la Web App** (se ve así: `https://script.google.com/macros/s/AKfycbw.../exec`)

### Paso 3: Configurar en el Chatbot

1. Abre `chat-data.js`
2. Cambia esta línea:
   ```javascript
   SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbzEjemplo/exec',
   ```
   Pega tu URL de Apps Script

3. Cambia:
   ```javascript
   USE_LOCAL_ONLY: true, // → false
   ```

---

## Opción 2: SheetDB.io (Alternativa Fácil - Sin Código)

1. Ve a [SheetDB.io](https://sheetdb.io)
2. Conecta con tu cuenta de Google
3. Selecciona tu Google Sheet
4. SheetDB generará una API automáticamente
5. Copia la URL de la API y pégala en:
   ```javascript
   SHEETDB_URL: 'https://sheetdb.io/api/v1/xxxxx',
   ```
6. Cambia `USE_LOCAL_ONLY: false`

---

## Estructura recomendada del Google Sheet

| pregunta | respuesta | categoria | palabras_clave |
|----------|-----------|-----------|----------------|
| ¿Qué tipos de combustibles distribuyen? | 🛢️ Distribuimos gasolina (95 y 91 octanos), diésel, kerosene, GLP y combustibles industriales. | Hidrocarburos | hidrocarburo, combustible, gasolina, diésel, diesel, kerosene, glp |
| ¿Cómo funciona el servicio de distribución? | 🚛 Contamos con flota especializada y monitoreo GPS 24/7. | Hidrocarburos | distribución, entrega, envío, logística, flota, reparto |
| ¿Ofrecen almacenamiento de hidrocarburos? | 🏭 Sí, terminales con monitoreo en tiempo real. | Hidrocarburos | almacenamiento, tanque, depósito, terminal, inventario |
| ¿Cómo solicito una cotización? | 📋 Por email, teléfono o formulario web. | General | cotización, precio, costo, presupuesto, tarifa |
| ¿Qué certificaciones tienen? | ✅ ISO 45001 (Seguridad) e ISO 14001 (Ambiental). | General | seguridad, certificación, iso, calidad, norma |
| ¿Qué suministros ofrecen? | 📦 Lubricantes, filtros, EPP, herramientas industriales. | Suministros | suministro, insumo, material, producto, lubricante, filtro |
| ¿Cómo ver el catálogo de productos? | 📑 Contáctanos para acceso al catálogo digital. | Suministros | catálogo, lista, portafolio, productos |
| ¿Qué tipo de transporte tienen? | 🚚 Más de 80 unidades: cisternas, camiones, carga. | Transporte | transporte, flete, carga, camión, cisterna, flota |
| ¿Cobertura de transporte? | 🗺️ Más de 15 regiones del país. | Transporte | cobertura, región, estado, nacional, ruta, destino |
| ¿Monitoreo GPS en tiempo real? | 📍 Sí, tracking 24/7 con geocercas. | Transporte | gps, monitoreo, tracking, rastreo, seguimiento |
| ¿Quiénes son Grupo San Luis? | 🏢 Más de 20 años, 500+ colaboradores, 3 unidades. | Empresa | grupo san luis, empresa, quienes son, historia |
| ¿Acciones de sostenibilidad? | 🌱 Gestión ambiental, reducción huella carbono. | Sostenibilidad | sostenibilidad, ambiente, ecológico, responsabilidad social |
| ¿Cómo contactarlos? | 📧 desarrollo.corpoagro@gmail.com 📞 +58 (251) 234-5678 | Contacto | contacto, teléfono, correo, email, dirección, oficina |
| ¿Horario de atención? | 🕐 Lun-Vie 8:00 AM - 5:00 PM. Emergencias 24/7. | Contacto | horario, lunes, viernes, atención |
| ¿Trabajan con...? | 👥 Envía CV a desarrollo.corpoagro@gmail.com | Recursos Humanos | trabajo, empleo, vacante, currículum, postular |

---

## Mantenimiento

- Solo necesitas editar el Google Sheet
- Los cambios se reflejan automáticamente en el chatbot
- Los emojis en las respuestas se mostrarán correctamente
- Puedes añadir o quitar preguntas en cualquier momento

