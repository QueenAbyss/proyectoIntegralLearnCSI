# 🏗️ **ESTRUCTURA DE CARPETAS - MODELO POR CAPAS**

## **📁 ESTRUCTURA ACTUAL:**

```
Proyecto_finalCSI/
├── 📁 app/                          # 🎯 CAPA DE APLICACIÓN
│   ├── pagina-principal.tsx         # ✅ Página principal en español
│   ├── aplicacion-principal.tsx     # ✅ App principal en español
│   ├── layout.tsx                   # Layout global
│   └── globals.css                  # Estilos globales
│
├── 📁 componentes/                  # 🎨 CAPA DE PRESENTACIÓN
│   ├── jardin-riemann.tsx           # ✅ Escenario 1 en español
│   ├── puente-teorema-fundamental.tsx # ✅ Escenario 2 en español
│   ├── torre-valor-medio.tsx        # ✅ Escenario 3 en español
│   ├── cristal-antiderivadas.tsx    # ✅ Escenario 4 en español
│   ├── canvas-arrastrable.tsx       # ✅ Canvas optimizado
│   ├── sistema-tutorial.tsx         # ✅ Sistema de tutoriales
│   ├── propiedades-integrales.tsx   # ✅ Panel de propiedades
│   ├── seccion-teorica.tsx          # ✅ Sección teórica
│   ├── navegacion-escenarios.tsx    # ✅ Navegación lateral
│   ├── formulario-login.tsx         # ✅ Sistema de login
│   └── verificacion-error.tsx       # ✅ Verificación de errores
│
├── 📁 components/ui/                # 🧩 CAPA DE COMPONENTES UI
│   ├── button.tsx                   # Botones
│   ├── card.tsx                     # Tarjetas
│   ├── slider.tsx                   # Deslizadores
│   ├── badge.tsx                    # Etiquetas
│   └── ... (otros componentes UI)
│
├── 📁 lib/                          # 🔧 CAPA DE UTILIDADES
│   └── utils.ts                     # Funciones utilitarias
│
├── 📁 hooks/                        # 🪝 CAPA DE HOOKS
│   ├── use-mobile.ts                # Hook para móvil
│   └── use-toast.ts                 # Hook para notificaciones
│
└── 📁 public/                       # 📁 RECURSOS ESTÁTICOS
    ├── placeholder-logo.png
    └── ...
```

## **🎯 MODELO POR CAPAS IMPLEMENTADO:**

### **1. CAPA DE APLICACIÓN (app/)**
- ✅ **Responsabilidad**: Puntos de entrada y configuración global
- ✅ **Contiene**: Páginas principales, layout, rutas
- ✅ **Nombres en español**: pagina-principal.tsx, aplicacion-principal.tsx

### **2. CAPA DE PRESENTACIÓN (componentes/)**
- ✅ **Responsabilidad**: Componentes de interfaz específicos del dominio
- ✅ **Contiene**: Escenarios, formularios, navegación
- ✅ **Nombres en español**: jardin-riemann.tsx, puente-teorema-fundamental.tsx

### **3. CAPA DE COMPONENTES UI (components/ui/)**
- ✅ **Responsabilidad**: Componentes reutilizables de interfaz
- ✅ **Contiene**: Botones, tarjetas, formularios básicos
- ✅ **Reutilizable**: Usado en toda la aplicación

### **4. CAPA DE UTILIDADES (lib/)**
- ✅ **Responsabilidad**: Funciones auxiliares y configuraciones
- ✅ **Contiene**: Utilidades matemáticas, helpers

### **5. CAPA DE HOOKS (hooks/)**
- ✅ **Responsabilidad**: Lógica de estado reutilizable
- ✅ **Contiene**: Hooks personalizados

### **6. CAPA DE RECURSOS (public/)**
- ✅ **Responsabilidad**: Archivos estáticos
- ✅ **Contiene**: Imágenes, iconos, recursos

## **🔧 VENTAJAS DEL MODELO POR CAPAS:**

1. **✅ Separación de responsabilidades**
2. **✅ Mantenibilidad mejorada**
3. **✅ Reutilización de componentes**
4. **✅ Escalabilidad**
5. **✅ Testing más fácil**
6. **✅ Nombres en español para claridad**

## **📋 PRÓXIMAS MEJORAS SUGERIDAS:**

### **Backend (Spring Boot):**
```
src/main/java/com/universidad/integraLearn/
├── 📁 controller/           # Controladores REST
├── 📁 service/             # Lógica de negocio
├── 📁 repository/          # Acceso a datos
├── 📁 model/               # Entidades JPA
├── 📁 dto/                 # Objetos de transferencia
├── 📁 config/              # Configuraciones
└── 📁 util/                # Utilidades
```

### **Base de Datos:**
```
📁 database/
├── 📁 migrations/          # Scripts de migración
├── 📁 seeds/              # Datos iniciales
└── 📁 schemas/            # Esquemas de BD
```


