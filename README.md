Empresa San Luis — Sitio Web CorporativoResumen del ProyectoEl proyecto Empresa San Luis se enfoca en el desarrollo del sitio web corporativo para una destacada empresa del sector energético, especializada en hidrocarburos, lubricantes, insumos y transporte.El sitio refleja la identidad de marca definida en su guía gráfica e implementa la arquitectura de una Aplicación Web Progresiva (PWA) para ofrecer alta accesibilidad, rendimiento y funcionamiento sin conexión.Módulos del ProyectoHeader (Encabezado): Menú de navegación principal, logotipo oficial y botón de contacto directo.Hero Section: Carrusel dinámico que destaca la misión de la empresa y sus servicios principales.Unidades de Negocio: Tarjetas interactivas para presentar las cuatro divisiones comerciales.Sobre Nosotros: Sección institucional con la historia, misión y valores corporativos.Sostenibilidad: Espacio dedicado a las iniciativas de responsabilidad ambiental.Contacto: Formulario funcional para atención e inquietudes de los usuarios.Footer (Pie de página): Enlaces institucionales, accesos rápidos y datos legales.Estructura de DirectoriosPlaintextapp/
└── frontend/
    ├── index.html           # Estructura principal en HTML
    ├── logo.png             # Logotipo oficial de la empresa
    ├── manifest.json        # Manifiesto de la PWA
    ├── package.json         # Dependencias y scripts del proyecto
    ├── script.js            # Lógica e interactividad en JavaScript
    ├── style.css            # Hojas de estilo y diseño visual
    ├── sw.js                # Service Worker para capacidades offline
    └── template_config.json # Configuración de plantillas
uploads/
└── GUÍA DE IDENTIDAD GRÁFICA SAN LUIS.pdf # Manual de marca corporativo
Inventario y Descripción de ArchivosArchivoDescripciónindex.htmlEstructura semántica del sitio web con todas sus secciones.logo.pngLogotipo oficial de San Luis ubicado en la cabecera del sitio.manifest.jsonMetadatos para la PWA (nombre, colores de tema e iconos de instalación).package.jsonLista de dependencias, librerías y scripts de compilación (build) y limpieza (lint).script.jsFunciones nativas en JS para interactividad, animaciones y menú.style.cssReglas de estilo que aplican los principios de diseño Material You y la guía de marca.sw.jsService Worker encargado del almacenamiento en caché y lectura offline.template_config.jsonParámetros y configuraciones para las plantillas dinámicas del sitio.Tecnologías UtilizadasHTML5: Marcado semántico y accesible.CSS3: Estilizado moderno utilizando variables CSS y diseño responsivo.JavaScript (Vanilla): Lógica ligera sin dependencias pesadas de frameworks.PWA: Funcionalidades de instalación móvil/escritorio y soporte offline.pnpm: Gestor de paquetes rápido para la administración del proyecto.Guía de Instalación y UsoRequisitos previosAsegúrate de tener instalado Node.js y el gestor de paquetes pnpm.Pasos de ejecuciónIngresar a la carpeta del frontend:Bashcd app/frontend
Instalar dependencias:Bashpnpm install
Verificar la calidad del código (Linting):Bashpnpm run lint
Compilar para producción:Bashpnpm run build
