# 🎨 Frontend: Playlist Manager App (Angular 19)

Este repositorio contiene la aplicación cliente desarrollada en Angular 19. La interfaz ha sido diseñada para ofrecer una experiencia de usuario fluida, reactiva y totalmente responsiva, permitiendo la gestión integral de listas de reproducción musicales.

---

# 📝 Descripción del Proyecto

La SPA (Single Page Application) permite a los usuarios interactuar de forma intuitiva con la API de Playlist Manager. Incluye módulos de autenticación, exploración de catálogos, creación de playlists personalizadas y una gestión avanzada de perfiles, todo bajo un diseño moderno con Tailwind CSS.

---

# 🛠️ Tecnologías Utilizadas

**Framework:** Angular 19.

**Estilos:** Tailwind CSS (Mobile-first design).

**Gestión de Estado:** Servicios inyectables con RxJS.

**Pruebas:** Jasmine & Karma.

**Seguridad:** Interceptores HTTP para gestión de JWT.

**Iconografía:** Inline SVGs y Heroicons.

---

# 🏗️ Explicación de la Arquitectura

Se ha implementado una arquitectura basada en Componentes y Servicios, siguiendo el principio de responsabilidad única:

Core Layer: Contiene servicios singleton (Auth, Playlists, Songs) e interceptores que gestionan la comunicación con el Backend.

Shared Layer: Modelos de datos (Interfaces) y servicios de notificaciones transversales.

Presentation Layer: Componentes modulares (Login, Home, PlaylistManager, Songs) que manejan la lógica de la UI.

Guards: Protección de rutas para asegurar que solo usuarios autenticados accedan al panel de gestión.

---

# 🚀 Instalación y Ejecución

Prerrequisitos:

Node.js (Versión 18 o superior).

Angular CLI instalado globalmente

```bash
npm install -g @angular/cli
```

Pasos:

Instalar dependencias:
```bash
npm install
```

Configurar entorno: Verificar el archivo src/environments/environment.ts con la URL de la API.

Ejecutar en desarrollo:
```bash
ng serve
```

Acceso: Abrir http://localhost:4200 en el navegador.

---

# ⚙️ Variables de Entorno Necesarias

Las configuraciones se encuentran en la carpeta src/environments/:

apiUrl: URL base de la API .NET (ej: https://localhost:7000).

production: Booleano para definir el entorno de compilación.

---

# 🧪 Instrucciones para Ejecutar Pruebas

Se ha puesto especial énfasis en la estabilidad del código mediante Pruebas Unitarias.

**Ejecutar pruebas:**
```bash
ng test --no-watch --code-coverage
```

Cobertura: El proyecto alcanza un 91.35% de cobertura, validando:

Inyección de tokens en el AuthInterceptor.

Lógica de formularios reactivos y validadores.

Comunicación asíncrona entre componentes y servicios.

Flujos de navegación y guardias de ruta.

---

# 💡 Justificación de Decisiones Técnicas

Formularios Reactivos: Se prefirieron sobre los basados en plantillas para permitir validaciones síncronas/asíncronas complejas y un mejor testeo unitario.

Tailwind CSS: Elegido por su capacidad de generar archivos CSS mínimos en producción y facilitar un diseño responsivo sin escribir media queries manuales.

Interceptores HTTP: Implementados para centralizar la lógica de seguridad, inyectando el token JWT en cada cabecera de forma transparente para el desarrollador.

RxJS: Uso de Observable para manejar la asincronía de la API, permitiendo una reactividad óptima en la UI.

---

# 📊 Explicación del Modelo de Datos

La aplicación consume modelos de TypeScript que mapean exactamente la estructura del backend:

User/LoginData: Manejo de la sesión y el perfil.

Playlist: Estructura de cabecera de las listas.

Song: Detalle de las pistas musicales.

Reply: Interfaz genérica para estandarizar todas las respuestas de la API.

---

# 💾 Plan de Backup y Recuperación (Frontend)

Aunque el Frontend es estático, se garantiza la continuidad mediante:

Control de Versiones: Repositorio en GitHub con historial completo.

CI/CD: Scripts listos para despliegue en entornos como Vercel o Netlify.

Persistencia Local: Uso de localStorage para mantener la sesión del usuario ante recargas accidentales del navegador.

---

# 🤖 Documentación del Uso de IA

Se utilizó IA como herramienta de aceleración de desarrollo en los siguientes puntos:

Generación de Mocks: Creación de datos de prueba para las suites de Jasmine.

Refactorización de CSS: Optimización de clases de Tailwind para mejorar la consistencia visual.

Troubleshooting de RxJS: Resolución de problemas de anidamiento de observables.

Documentación: Generación de la estructura base de este README siguiendo requerimientos técnicos.

---

**Autor:** Carlos Estrada | Año: 2026
````
