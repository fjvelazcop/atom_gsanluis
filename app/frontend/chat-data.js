// ============================================
// GRUPO SAN LUIS - Chatbot FAQ Data
// Preguntas frecuentes con matching semántico
// Google Sheets URL configurada abajo
// ============================================

const CHAT_CONFIG = {
    // === GOOGLE SHEETS API ===
    // Opción 1: Google Apps Script Web App (recomendado)
    // Reemplaza con tu URL desplegada de Apps Script
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbzEjemplo/exec',
    
    // Opción 2: SheetDB.io (alternativa fácil, sin código)
    // https://sheetdb.io/ - free tier disponible
    SHEETDB_URL: '',

    // Opción 3: Usar solo datos locales (no requiere API)
    USE_LOCAL_ONLY: true, // Cambiar a false cuando tengas el Google Sheet

    // Config del chatbot
    BOT_NAME: 'Luis',
    WELCOME_MESSAGE: '👋 ¡Hola! Soy **Luis**, el asistente virtual de Grupo San Luis. Estoy aquí para ayudarte con información sobre nuestros servicios de Hidrocarburos, Suministros y Transporte. ¿En qué puedo ayudarte el día de hoy?',
    FALLBACK_MESSAGE: '🤔 Disculpa, no encontré información específica sobre esa consulta. Por favor, déjanos tus datos y un asesor se comunicará contigo a la brevedad.',
    ERROR_MESSAGE: '⚠️ Ocurrió un error al consultar la información. Por favor, intenta de nuevo más tarde.',
    CONTACT_SUCCESS: '✅ ¡Gracias! Hemos recibido tu consulta. Un asesor del área correspondiente se comunicará contigo pronto.',
};

// ============================================
// FAQ LOCAL DATASET (Fallback / Modo local)
// ============================================
// Cuando USE_LOCAL_ONLY = true, usa estos datos
// Cuando tengas Google Sheets, pon USE_LOCAL_ONLY = false
// y sigue las instrucciones en GOOGLE_SHEETS_GUIDE.md

const FAQ_DATA = [
    // === HIDROCARBUROS ===
    {
        keywords: ['hidrocarburo', 'combustible', 'gasolina', 'diésel', 'diesel', 'gasoil', 'gas oil', 'petróleo', 'petroleo', 'kerosene', 'quero', 'gas licuado', 'glp'],
        question: '¿Qué tipos de combustibles distribuyen?',
        answer: '🛢️ Distribuimos una amplia gama de hidrocarburos incluyendo: gasolina (95 y 91 octanos), diésel, kerosene, GLP (gas licuado de petróleo) y combustibles industriales. Todos nuestros productos cumplen con las normas internacionales de calidad.'
    },
    {
        keywords: ['distribución', 'distribucion', 'entrega', 'envío', 'envio', 'delivery', 'logística', 'logistica', 'flota'],
        question: '¿Cómo funciona el servicio de distribución de hidrocarburos?',
        answer: '🚛 Contamos con una flota especializada y un sistema logístico optimizado que garantiza entregas puntuales y seguras. Nuestros conductores están certificados y cada vehículo cuenta con monitoreo GPS 24/7. Trabajamos con rutas programadas y también atendemos urgencias.'
    },
    {
        keywords: ['almacenamiento', 'tanque', 'depósito', 'deposito', 'terminal', 'bodega', 'inventario', 'stock', 'reserva'],
        question: '¿Ofrecen servicios de almacenamiento de hidrocarburos?',
        answer: '🏭 Sí, contamos con terminales de almacenamiento con capacidad estratégica, equipadas con tecnología de monitoreo y control de inventarios en tiempo real. Nuestras instalaciones cumplen con todas las normas de seguridad industrial y gestión ambiental.'
    },
    {
        keywords: ['precio', 'costo', 'cotización', 'cotizacion', 'tarifa', 'valor', 'presupuesto', 'cuanto cuesta'],
        question: '¿Cómo puedo solicitar una cotización?',
        answer: '📋 Puedes solicitar una cotización personalizada a través del formulario en nuestra página o directamente con nuestro equipo comercial. Escríbenos a desarrollo.corpoagro@gmail.com o llámanos al +58 (251) 234-5678. También puedes dejarnos tus datos en el formulario de este chat y te contactaremos.'
    },
    {
        keywords: ['seguridad', 'norma', 'certificado', 'iso', 'calidad', 'protocolo', 'regulación', 'regulacion'],
        question: '¿Qué certificaciones de seguridad tienen?',
        answer: '✅ Operamos bajo los más estrictos estándares de seguridad industrial certificados bajo normas ISO 45001 (Seguridad y Salud) e ISO 14001 (Gestión Ambiental). Realizamos auditorías periódicas y programas de mejora continua en todas nuestras operaciones.'
    },

    // === SUMINISTROS ===
    {
        keywords: ['suministro', 'insumo', 'material', 'producto', 'proveedor', 'provision', 'abastecimiento', 'compra', 'adquisición', 'adquisicion'],
        question: '¿Qué tipos de suministros e insumos ofrecen?',
        answer: '📦 Ofrecemos un amplio portafolio de productos industriales que incluye: lubricantes, filtros, repuestos, equipos de protección personal (EPP), materiales de operación, herramientas industriales y más. Trabajamos con los mejores proveedores nacionales e internacionales.'
    },
    {
        keywords: ['catálogo', 'catalogo', 'lista', 'portafolio', 'inventario de productos', 'qué venden', 'que venden'],
        question: '¿Dónde puedo ver el catálogo de productos?',
        answer: '📑 Contamos con un catálogo digital actualizado de nuestros productos. Para acceder a él, puedes contactar a nuestro equipo comercial vía email o WhatsApp. También podemos enviarte el catálogo según tu industria y necesidades específicas.'
    },
    {
        keywords: ['logística', 'logistica', 'entrega', 'envio', 'plazo', 'tiempo entrega', 'demora', 'rapidez'],
        question: '¿Cuál es el tiempo de entrega de los suministros?',
        answer: '⏱️ Nuestro sistema logístico JIT (Just In Time) nos permite entregar en un plazo de 24 a 72 horas hábiles, dependiendo de la ubicación y la disponibilidad del producto. Tenemos una tasa de cumplimiento de entregas del 98%. Para urgencias, contamos con servicio express.'
    },

    // === TRANSPORTE ===
    {
        keywords: ['transporte', 'flete', 'carga', 'camión', 'camion', 'cisterna', 'flota', 'vehículo', 'vehiculo', 'unidad'],
        question: '¿Qué tipo de transporte ofrecen?',
        answer: '🚚 Contamos con una flota moderna de más de 80 unidades especializadas que incluye: cisternas para combustibles, camiones para carga general, unidades para materiales peligrosos y vehículos de carga seca. Toda nuestra flota cuenta con mantenimiento preventivo certificado.'
    },
    {
        keywords: ['cobertura', 'destino', 'zona', 'región', 'region', 'estado', 'nacional', 'país', 'pais', 'ruta', 'ciudad'],
        question: '¿A qué regiones tienen cobertura?',
        answer: '🗺️ Tenemos cobertura nacional en más de 15 regiones/estados del país. Nuestra red de rutas está optimizada para llegar a zonas urbanas, industriales y remotas. Contamos con alianzas estratégicas que amplían nuestro alcance geográfico.'
    },
    {
        keywords: ['monitoreo', 'gps', 'tracking', 'rastreo', 'seguimiento', 'ubicación', 'ubicacion', 'tiempo real', 'localización', 'localizacion'],
        question: '¿Tienen monitoreo en tiempo real?',
        answer: '📍 Sí, todas nuestras unidades cuentan con sistema GPS con tracking 24/7, geocercas, control de velocidad y reportes automatizados. Nuestros clientes reciben información en tiempo real sobre la ubicación y estado de su carga a través de nuestra plataforma.'
    },
    {
        keywords: ['seguridad carga', 'mercancía', 'mercancias', 'material peligroso', 'riesgo', 'accidente', 'seguro', 'póliza', 'poliza'],
        question: '¿Cómo garantizan la seguridad de la carga?',
        answer: '🛡️ Nuestra tasa de seguridad es del 99.9%. Cada unidad cuenta con sistemas de seguridad avanzados, conductores certificados y capacitados, seguros de carga vigentes, protocolos de respuesta a emergencias y cumplimiento estricto de normativas para materiales peligrosos.'
    },

    // === GENERAL / EMPRESA ===
    {
        keywords: ['grupo san luis', 'empresa', 'compañía', 'compañia', 'corporación', 'corporacion', 'quienes son', 'quienes somos', 'historia', 'trayectoria'],
        question: '¿Quiénes son Grupo San Luis?',
        answer: '🏢 **Grupo San Luis** es un grupo empresarial con más de 20 años de trayectoria en el sector energético e industrial. Contamos con 3 unidades de negocio: Hidrocarburos, Suministros y Transporte. Tenemos más de 500 colaboradores y presencia en más de 15 regiones del país.'
    },
    {
        keywords: ['sostenibilidad', 'ambiente', 'ecológico', 'ecologico', 'verde', 'medio ambiente', 'responsabilidad social', 'comunidad', 'ambiental'],
        question: '¿Qué acciones de sostenibilidad realizan?',
        answer: '🌱 Estamos comprometidos con el desarrollo sostenible. Implementamos sistemas de gestión ambiental certificados, programas de reducción de huella de carbono, inversión social en educación y salud comunitaria, y protocolos de seguridad de clase mundial que protegen a nuestros colaboradores y el entorno.'
    },
    {
        keywords: ['contacto', 'teléfono', 'telefono', 'correo', 'email', 'dirección', 'direccion', 'ubicación', 'ubicacion', 'oficina', 'atención', 'atencion'],
        question: '¿Cómo puedo contactarlos?',
        answer: '📞 Puedes contactarnos a través de:\n• 📧 Email: desarrollo.corpoagro@gmail.com\n• 📞 Teléfono: +58 (251) 234-5678\n• 📍 Dirección: Av. Principal las industrias, Zona Industrial II, Barquisimeto - Venezuela\n• 💬 O puedes dejarnos tu consulta aquí mismo en el chat.'
    },
    {
        keywords: ['horario', 'horario atencion', 'horario atención', 'lunes', 'viernes', 'horario laboral', 'abierto', 'cerrado'],
        question: '¿Cuál es el horario de atención?',
        answer: '🕐 Nuestro horario de atención comercial es de lunes a viernes de 8:00 AM a 5:00 PM. Para emergencias operativas, contamos con disponibilidad 24/7 a través de nuestra línea de atención: +58 (251) 234-5678.'
    },
    {
        keywords: ['trabajo', 'empleo', 'vacante', 'carrera', 'curriculum', 'postular', 'trabajar', 'oportunidad', 'talento', 'reclutamiento'],
        question: '¿Tienen oportunidades de trabajo?',
        answer: '👥 Constantemente buscamos talento para unirse a nuestro equipo. Las oportunidades laborales se publican en nuestras redes sociales y LinkedIn. También puedes enviar tu currículum a desarrollo.corpoagro@gmail.com y lo mantendremos en nuestra base de datos.'
    },
    {
        keywords: ['gracias', 'gracias totales'],
        question: '¡Gracias!',
        answer: '😊 ¡Ha sido un placer ayudarte! Si tienes más preguntas, no dudes en escribirme. ¡Que tengas un excelente día!'
    }
];

// ============================================
// Matching Logic
// ============================================

function findBestMatch(userMessage) {
    const message = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    let bestMatch = null;
    let bestScore = 0;

    FAQ_DATA.forEach(function (item) {
        let score = 0;
        item.keywords.forEach(function (keyword) {
            const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (message.includes(normalizedKeyword)) {
                score += 1;
            }
            // Also check if keyword is part of a word
            const regex = new RegExp('\\b' + normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
            if (regex.test(message)) {
                score += 2; // Higher score for whole word match
            }
        });

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    });

    // Threshold: at least 1 keyword match
    if (bestScore >= 1) {
        return bestMatch;
    }

    return null;
}

// ============================================
// Google Sheets API Fetcher
// ============================================

async function fetchFAQFromSheets() {
    if (CHAT_CONFIG.USE_LOCAL_ONLY) {
        return FAQ_DATA;
    }

    try {
        let url;
        if (CHAT_CONFIG.SHEETS_API_URL) {
            url = CHAT_CONFIG.SHEETS_API_URL;
        } else if (CHAT_CONFIG.SHEETDB_URL) {
            url = CHAT_CONFIG.SHEETDB_URL;
        } else {
            return FAQ_DATA;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data.map(function (row) {
                return {
                    keywords: (row.keywords || row.palabras_clave || '').split(',').map(function (k) { return k.trim(); }),
                    question: row.question || row.pregunta || '',
                    answer: row.answer || row.respuesta || ''
                };
            });
        }
        return FAQ_DATA;
    } catch (error) {
        console.warn('Error fetching from Google Sheets, using local data:', error);
        return FAQ_DATA;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FAQ_DATA, findBestMatch, fetchFAQFromSheets, CHAT_CONFIG };
}

