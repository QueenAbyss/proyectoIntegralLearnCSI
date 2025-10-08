# 🚀 Instrucciones para ejecutar el Jardín Mágico de Riemann en Visual Studio Code

## 📋 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

### 1. Node.js (versión 18 o superior)
- Descarga desde: https://nodejs.org/
- Verifica la instalación: `node --version` y `npm --version`

### 2. Visual Studio Code
- Descarga desde: https://code.visualstudio.com/

### 3. Extensiones recomendadas para VS Code:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## 🛠️ Instalación y configuración

### Paso 1: Descargar el proyecto
1. Descarga el archivo ZIP del proyecto desde v0
2. Extrae el contenido en una carpeta de tu elección
3. Abre Visual Studio Code
4. Ve a `File > Open Folder` y selecciona la carpeta del proyecto

### Paso 2: Instalar dependencias
Abre la terminal integrada en VS Code (`Ctrl + ` ` o `View > Terminal`) y ejecuta:

\`\`\`bash
npm install
\`\`\`

### Paso 3: Ejecutar el proyecto
Una vez instaladas las dependencias, ejecuta:

\`\`\`bash
npm run dev
\`\`\`

### Paso 4: Abrir en el navegador
- El proyecto se ejecutará en: `http://localhost:3000`
- Se abrirá automáticamente en tu navegador predeterminado
- Si no se abre automáticamente, copia y pega la URL en tu navegador

## 🎮 Cómo usar la aplicación

### Modo Guiado
1. Haz clic en "Modo Guiado" para iniciar el tutorial
2. Sigue las instrucciones del Hada Aria paso a paso
3. Las flechas amarillas te indicarán exactamente qué elementos tocar
4. Solo podrás interactuar con los elementos resaltados en amarillo
5. Completa cada paso antes de avanzar al siguiente

### Modo Libre
1. Haz clic en "Modo Libre" para explorar libremente
2. Arrastra los puntos rojos y azules en el gráfico para cambiar límites
3. Ajusta todos los controles como desees
4. Experimenta con diferentes funciones y configuraciones

## 🔧 Estructura del proyecto

\`\`\`
riemann-garden/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout base
│   └── globals.css       # Estilos globales
├── components/
│   ├── ui/               # Componentes de interfaz
│   ├── tutorial-system.tsx      # Sistema de tutorial
│   ├── draggable-canvas.tsx     # Canvas interactivo
│   ├── properties-visualizer.tsx # Visualizador de propiedades
│   └── error-verification.tsx   # Sistema de verificación
├── package.json          # Dependencias del proyecto
└── README.md            # Documentación
\`\`\`

## 🐛 Solución de problemas comunes

### Error: "Module not found"
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Error: "Port 3000 is already in use"
\`\`\`bash
npm run dev -- --port 3001
\`\`\`

### La aplicación no se actualiza automáticamente
- Guarda los archivos con `Ctrl + S`
- Recarga el navegador con `F5`

## 🚀 Preparación para el backend (Spring Boot)

El proyecto está preparado para conectarse con un backend Spring Boot:

### Estructura preparada:
- **API hooks**: Funciones preparadas en `/lib/api.ts` (se creará después)
- **Tipos TypeScript**: Interfaces definidas para datos del backend
- **Estado global**: Configurado para manejar datos del servidor
- **Autenticación**: Componentes preparados para login/registro

### Endpoints que el backend deberá proporcionar:
- `POST /api/auth/login` - Autenticación de usuarios
- `GET /api/functions` - Obtener funciones matemáticas
- `POST /api/simulations` - Guardar simulaciones
- `GET /api/user/progress` - Progreso del usuario

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta del proyecto
3. Revisa que todas las dependencias se hayan instalado
4. Consulta la consola del navegador para errores específicos

¡Disfruta explorando el mundo mágico de las integrales de Riemann! 🧚‍♀️✨
