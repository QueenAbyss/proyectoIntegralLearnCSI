# Jardín Mágico de Riemann - Simulación Interactiva de Integrales

Una aplicación educativa interactiva para aprender sobre integrales de Riemann y sus propiedades, con temática de jardín mágico.

## 🌟 Características

- **Modo Guiado**: Tutorial paso a paso con el hada jardinera
- **Modo Libre**: Interacción completa con arrastre de límites
- **Visualización de Propiedades**: 6 propiedades fundamentales de las integrales
- **Temática Mágica**: Macetas de flores en lugar de rectángulos tradicionales
- **Verificación de Errores**: Sistema que evalúa la precisión de las aproximaciones

## 🚀 Instalación y Uso en VS Code

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Visual Studio Code

### Pasos de instalación:

1. **Descargar el proyecto**
   - Descarga el ZIP desde v0
   - Extrae los archivos en tu carpeta de proyectos

2. **Abrir en VS Code**
   \`\`\`bash
   cd riemann-garden
   code .
   \`\`\`

3. **Instalar dependencias**
   \`\`\`bash
   npm install
   # o
   yarn install
   \`\`\`

4. **Ejecutar en modo desarrollo**
   \`\`\`bash
   npm run dev
   # o
   yarn dev
   \`\`\`

5. **Abrir en el navegador**
   - Ve a `http://localhost:3000`
   - La aplicación se recargará automáticamente al hacer cambios

### Estructura del proyecto:
\`\`\`
riemann-garden/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout base
│   └── globals.css       # Estilos globales
├── components/
│   ├── tutorial-system.tsx      # Sistema de tutorial guiado
│   ├── properties-visualizer.tsx # Visualizador de propiedades
│   ├── draggable-canvas.tsx     # Canvas interactivo
│   ├── error-verification.tsx   # Sistema de verificación
│   └── ui/               # Componentes de interfaz
└── README.md
\`\`\`

## 🎮 Cómo usar la aplicación

1. **Modo Guiado**: Sigue las instrucciones del hada jardinera paso a paso
2. **Modo Libre**: Arrastra los puntos rojos y azules para cambiar los límites
3. **Propiedades**: Explora las 6 propiedades fundamentales de las integrales
4. **Verificación**: El sistema te dirá cuándo tu aproximación es suficientemente precisa

## 🔧 Preparación para Backend

El frontend está preparado para conectarse con un backend Spring Boot:
- Estructura modular de componentes
- Separación clara de lógica de presentación
- Hooks preparados para llamadas API
- Sistema de estado listo para integración con servicios REST

## 📚 Propiedades Implementadas

1. **Linealidad**: Combinación lineal de integrales
2. **Aditividad**: Suma de áreas en intervalos divididos
3. **Monotonía**: Comparación de funciones y sus integrales
4. **Sumas de Riemann**: Aproximación fundamental
5. **Teorema Fundamental**: Conexión derivada-integral
6. **Sustitución**: Cambio de variable para simplificar

## 🎨 Tecnologías Utilizadas

- **React 18** con JSX
- **Next.js 14** (App Router)
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Canvas API** para gráficos interactivos
