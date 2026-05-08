# ContaMind AI — Product Requirements Document
## Frontend Specification v1.0

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Autor:** Juan Bernardo — ContaMind AI  
**Estado:** Draft → Revisión  
**Alcance:** Frontend completo de la plataforma SaaS (Web App)

---

## TABLA DE CONTENIDOS

1. [Visión General del Producto](#1-visión-general-del-producto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Sistema de Diseño](#3-sistema-de-diseño)
4. [Arquitectura de la Aplicación](#4-arquitectura-de-la-aplicación)
5. [Responsive Design & Breakpoints](#5-responsive-design--breakpoints)
6. [Sistema de Animaciones — Framer Motion](#6-sistema-de-animaciones--framer-motion)
7. [Módulo: Autenticación & Onboarding](#7-módulo-autenticación--onboarding)
8. [Shell Principal — Layout & Navegación](#8-shell-principal--layout--navegación)
9. [Módulo: Dashboard Principal](#9-módulo-dashboard-principal)
10. [Módulo: Contabilidad & Finanzas](#10-módulo-contabilidad--finanzas)
11. [Módulo: Facturación & Ventas](#11-módulo-facturación--ventas)
12. [Módulo: Compras & Proveedores](#12-módulo-compras--proveedores)
13. [Módulo: Inventario & Logística](#13-módulo-inventario--logística)
14. [Módulo: Impuestos & Cumplimiento SRI](#14-módulo-impuestos--cumplimiento-sri)
15. [Módulo: Tesorería](#15-módulo-tesorería)
16. [Módulo: Costos & Producción](#16-módulo-costos--producción)
17. [Módulo: Nómina & RRHH](#17-módulo-nómina--rrhh)
18. [Módulo: Activos Fijos](#18-módulo-activos-fijos)
19. [Módulo: Reportería & Business Intelligence](#19-módulo-reportería--business-intelligence)
20. [Módulo: CRM](#20-módulo-crm)
21. [Módulo: Descarga de Documentos Electrónicos](#21-módulo-descarga-de-documentos-electrónicos)
22. [Módulo: Agente IA en Telegram](#22-módulo-agente-ia-en-telegram)
23. [Módulo: IA & Automatización](#23-módulo-ia--automatización)
24. [Módulo: Integraciones & APIs](#24-módulo-integraciones--apis)
25. [Módulo: Seguridad & Administración](#25-módulo-seguridad--administración)
26. [Módulo: Configuración de Empresa](#26-módulo-configuración-de-empresa)
27. [Componentes Globales Reutilizables](#27-componentes-globales-reutilizables)
28. [Estados Globales & Feedback al Usuario](#28-estados-globales--feedback-al-usuario)
29. [Accesibilidad (a11y)](#29-accesibilidad-a11y)
30. [Performance & Optimización](#30-performance--optimización)

---

## 1. VISIÓN GENERAL DEL PRODUCTO

### 1.1 Descripción

ContaMind AI es un ERP AI-native diseñado para PYMEs ecuatorianas. El frontend debe transmitir la misma filosofía que el producto: **inteligencia hecha simple**. La interfaz es el punto de contacto diario del usuario con su empresa — debe ser confiable, veloz, hermosa y no intimidar.

La estética es Apple-inspired: espacio generoso, jerarquía tipográfica precisa, y una paleta que guía la atención sin competir por ella. La sofisticación se expresa mediante la contención.

### 1.2 Principios de Producto

| Principio | Descripción |
|---|---|
| **Claridad sobre densidad** | Cada pantalla tiene una sola acción principal. El usuario nunca debe preguntarse qué hacer. |
| **IA como copiloto, no como protagonista** | La IA aparece cuando agrega valor. No es decorativa ni invasiva. |
| **Cero fricciones en flujos críticos** | Crear una factura, registrar un pago, descargar documentos: ≤3 clics. |
| **Feedback inmediato** | Toda acción del usuario tiene respuesta visual en ≤100ms. |
| **Diseño que respeta el contexto** | Contadores, mesas redondas, importadores. El ERP se adapta a ellos. |

### 1.3 Usuarios Objetivo

| Rol | Acceso | Pantallas clave |
|---|---|---|
| Gerente/Dueño | Lectura total + aprobaciones | Dashboard, BI, Tesorería, CRM |
| Contador | Contabilidad, impuestos, SRI | Contabilidad, Facturación, SRI |
| Vendedor | CRM, ventas, facturación | Facturación, CRM, Inventario |
| Bodeguero | Inventario, logística | Inventario, Compras |
| RRHH | Nómina, empleados | Nómina, Activos |
| Admin TI | Configuración, integraciones | Seguridad, Integraciones |

---

## 2. STACK TECNOLÓGICO

### 2.1 Core

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.2 | UI library |
| TypeScript | 5.7+ | Type safety |
| Vite | 6.x | Build tool |
| React Router v7 | 7.x | Routing SPA |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 11.x | Animaciones y transiciones |
| Zustand | 5.x | State management global |
| TanStack Query | 5.x | Server state, caching, sync |
| Axios | 1.x | HTTP client con interceptors |

### 2.2 UI & Componentes

| Librería | Uso |
|---|---|
| Lucide React | Iconografía consistente |
| Recharts | Gráficos de datos (línea, barra, donut) |
| React Hook Form + Zod | Formularios con validación tipada |
| @tanstack/react-table | Tablas de datos avanzadas |
| cmdk | Command palette (⌘K) |
| Sonner | Toast notifications |
| Vaul | Drawers mobile-first |
| date-fns | Manejo de fechas |
| numeral.js | Formateo de moneda y números |

### 2.3 Fuentes

```html
<!-- En index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### 2.4 Variables de Entorno

```env
VITE_API_URL=https://api.contamind.io
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_TELEGRAM_BOT_USERNAME=@ContaMindBot
VITE_SENTRY_DSN=...
```

---

## 3. SISTEMA DE DISEÑO

### 3.1 Design Tokens (globals.css)

```css
:root {
  /* Backgrounds */
  --white:        #ffffff;
  --off-white:    #f5f5f7;

  /* Borders */
  --border:       #e0e0e5;
  --border-light: #ebebf0;

  /* Text */
  --text-1: #1d1d1f;
  --text-2: #424245;
  --text-3: #6e6e73;
  --text-4: #aeaeb2;

  /* Brand */
  --accent:       #0071e3;
  --accent-hover: #0077ed;
  --accent-soft:  #e8f0fc;

  /* Semantic */
  --green:        #30d158;
  --green-soft:   #e6f9ed;
  --red:          #ff3b30;
  --red-soft:     #fff0f0;
  --amber:        #ff9f0a;
  --amber-soft:   #fff8ec;

  /* Typography */
  --serif: 'Instrument Serif', Georgia, serif;
  --sans:  'Geist', -apple-system, sans-serif;

  /* Radius */
  --radius:    18px;
  --radius-sm: 10px;
  --radius-pill: 24px;

  /* Shadows */
  --shadow-subtle:   0 1px 4px rgba(0,0,0,0.05);
  --shadow-default:  0 4px 20px rgba(0,0,0,0.07);
  --shadow-prominent: 0 8px 40px rgba(0,0,0,0.10);

  /* Transitions */
  --ease-ui: 0.15s ease;
  --ease-reveal: 0.55s ease;
}
```

### 3.2 Tipografía

```css
/* Escala tipográfica */
.type-display  { font-family: var(--serif); font-size: clamp(3rem, 6vw, 5rem); font-weight: 400; letter-spacing: -0.02em; }
.type-h1       { font-family: var(--serif); font-size: clamp(1.9rem, 3.5vw, 2.9rem); font-weight: 400; letter-spacing: -0.02em; }
.type-h2       { font-family: var(--sans); font-size: 1.05rem; font-weight: 600; }
.type-body     { font-family: var(--sans); font-size: 0.97rem; font-weight: 400; line-height: 1.65; }
.type-small    { font-family: var(--sans); font-size: 0.82rem; font-weight: 400; line-height: 1.58; }
.type-label    { font-family: var(--sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; }
.type-tag      { font-family: var(--sans); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.04em; }
.type-meta     { font-family: var(--sans); font-size: 0.67rem; font-weight: 400; letter-spacing: 0.08em; color: var(--text-4); }
```

### 3.3 Componentes Base

#### Card
```tsx
// Dos variantes: filled (sobre white) y white (sobre off-white)
<Card variant="white" className="p-7 rounded-[18px] border border-[#ebebf0] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
  {children}
</Card>
```

#### Button
```tsx
// Variantes: primary | ghost | white | ghost-white | danger
// Siempre pill-shaped: border-radius 24px
<Button variant="primary">Guardar</Button>
<Button variant="ghost">Cancelar</Button>
```

#### Badge / Tag
```tsx
// Padding 4px 12px, radius 20px, size 0.72rem
<Badge variant="success">Pagado</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="error">Vencido</Badge>
<Badge variant="info">Borrador</Badge>
```

#### Input / Select
```tsx
// border-radius: var(--radius-sm) = 10px
// border: 1px solid var(--border)
// focus: border-color var(--accent), ring accent-soft
<Input label="RUC" placeholder="1234567890001" />
```

### 3.4 Iconografía

- **Tamaño estándar:** 16px (inline/texto), 20px (controles), 24px (card headers), 32px (empty states)
- **Librería:** Lucide React exclusivamente
- **Regla:** Siempre acompañar con label de texto o tooltip accesible

### 3.5 Mockup Visual — Anatomía de una pantalla tipo

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR: Logo | Breadcrumb            ⌘K  🔔  Avatar            │  48px, blur(20px)
├──────────────┬──────────────────────────────────────────────────┤
│              │  PAGE HEADER                                      │
│  SIDEBAR     │  ┌────────────────────────────────────────────┐  │
│  240px       │  │ [Section Label]  H1 (Serif)   [CTA button] │  │
│              │  └────────────────────────────────────────────┘  │
│  Nav items   │                                                   │
│  (icono +    │  STATS ROW: 3–4 KPI cards                       │
│   label)     │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│              │  │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  │           │
│  AI Badge    │  └──────┘ └──────┘ └──────┘ └──────┘           │
│              │                                                   │
│  ─────────   │  CONTENT AREA                                    │
│  User info   │  [Tabla / Gráfico / Lista / Form]               │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 4. ARQUITECTURA DE LA APLICACIÓN

### 4.1 Estructura de Carpetas

```
src/
├── app/                    # Router config, providers, shell
│   ├── App.tsx
│   ├── Router.tsx
│   └── Providers.tsx
├── modules/                # Un folder por módulo de negocio
│   ├── auth/
│   ├── dashboard/
│   ├── accounting/
│   ├── invoicing/
│   ├── purchasing/
│   ├── inventory/
│   ├── taxes/
│   ├── treasury/
│   ├── costing/
│   ├── payroll/
│   ├── assets/
│   ├── bi/
│   ├── crm/
│   ├── documents/
│   ├── telegram/
│   ├── ai/
│   ├── integrations/
│   └── admin/
├── shared/
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Custom hooks
│   ├── stores/             # Zustand stores
│   ├── services/           # API calls
│   ├── utils/              # Helpers, formatters
│   └── types/              # TypeScript interfaces globales
├── design-system/
│   ├── tokens.css
│   ├── typography.css
│   └── animations.ts       # Variantes Framer Motion
└── assets/
```

### 4.2 Estructura de cada módulo

```
modules/invoicing/
├── components/             # Componentes específicos del módulo
├── pages/                  # Páginas (rutas)
├── hooks/                  # Hooks del módulo
├── services/               # Llamadas API del módulo
├── store/                  # Estado local del módulo
├── types/                  # Tipos específicos
└── index.ts                # Exports públicos
```

### 4.3 Routing

```tsx
// Rutas principales
/auth/login
/auth/register
/auth/forgot-password

/app/dashboard
/app/accounting/*
/app/invoicing/*
/app/purchasing/*
/app/inventory/*
/app/taxes/*
/app/treasury/*
/app/costing/*
/app/payroll/*
/app/assets/*
/app/bi/*
/app/crm/*
/app/documents/*
/app/telegram
/app/ai/*
/app/integrations/*
/app/admin/*
/app/settings/*
```

### 4.4 Guards de Autenticación y Permisos

```tsx
// ProtectedRoute: verifica JWT válido
// RoleGuard: verifica permisos por módulo
<ProtectedRoute>
  <RoleGuard module="invoicing" permission="write">
    <InvoicingModule />
  </RoleGuard>
</ProtectedRoute>
```

---

## 5. RESPONSIVE DESIGN & BREAKPOINTS

### 5.1 Breakpoints (Tailwind 4.x)

```js
// tailwind.config
screens: {
  'xs':  '375px',   // iPhone SE
  'sm':  '640px',   // Large mobile
  'md':  '768px',   // Tablet portrait
  'lg':  '1024px',  // Tablet landscape / small laptop
  'xl':  '1280px',  // Desktop
  '2xl': '1440px',  // Large desktop
  '3xl': '1920px',  // Wide / ultrawide
}
```

### 5.2 Comportamiento por Dispositivo

| Elemento | Mobile (< 768px) | Tablet (768–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Sidebar | Bottom nav bar (5 items) | Sidebar colapsable (iconos) | Sidebar expandido (240px) |
| Tablas | Cards apiladas verticalmente | Tabla con scroll horizontal | Tabla completa |
| KPI Cards | 1 columna (stack) | 2 columnas | 3–4 columnas |
| Formularios | Full-width, stacked | 2 columnas | 2–3 columnas |
| Modales | Full-screen drawer (Vaul) | Centered modal 80% | Centered modal 600px max |
| Gráficos | Simplificados / scroll | Completos | Completos con leyenda |
| Topbar | Hamburger + logo + avatar | Logo + search + avatar | Logo + search + notif + avatar |

### 5.3 Mobile Navigation

En mobile, el sidebar se reemplaza por una **bottom navigation bar** fija con los 5 módulos más usados del rol activo. Un botón "Más" abre un drawer con el resto de módulos.

```
┌──────────────────────────────────────┐
│         CONTENT AREA                 │
│                                      │
├──────────────────────────────────────┤
│  🏠      📄      🛒      👥    ⋯    │  ← Bottom nav (48px)
│Dashboard Facturas Compras CRM  Más  │
└──────────────────────────────────────┘
```

### 5.4 Touch Targets

- Mínimo 44×44px para cualquier elemento interactivo en mobile
- Swipe gestures en listas para acciones rápidas (editar, eliminar)
- Pull-to-refresh en listas y dashboards

---

## 6. SISTEMA DE ANIMACIONES — FRAMER MOTION

### 6.1 Variantes Base (design-system/animations.ts)

```ts
import { Variants } from 'framer-motion';

// Fade + rise — scroll reveals, page entries
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

// Stagger container — listas y grillas de cards
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Card item — para children de stagger
export const cardItem: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Scale pop — confirmaciones, badges de éxito
export const scalePop: Variants = {
  hidden:  { scale: 0.92, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } },
};

// Slide in from right — panels laterales, drawers
export const slideInRight: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.30, ease: [0.32, 0.72, 0, 1] } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

// Slide in from left — sidebar mobile
export const slideInLeft: Variants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.20, ease: 'easeIn' } },
};

// Modal entrance
export const modalEnter: Variants = {
  hidden:  { scale: 0.96, opacity: 0, y: 8 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } },
  exit:    { scale: 0.96, opacity: 0, y: 4, transition: { duration: 0.15, ease: 'easeIn' } },
};

// Page transition — entre rutas
export const pageTransition: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.30, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// Number counter — KPIs animados al entrar
export const counterConfig = { duration: 1.2, ease: 'easeOut' };

// Chart bar stagger — 55ms entre barras
export const chartBarStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
};

export const chartBar: Variants = {
  hidden:  { scaleY: 0, originY: 1 },
  visible: { scaleY: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};
```

### 6.2 Reglas de Uso

| Contexto | Variante | Notas |
|---|---|---|
| Entrada de página | `pageTransition` | Wrap `<motion.div>` en cada página |
| Cards en grilla | `staggerContainer` + `cardItem` | Activar en viewport con `whileInView` |
| Modales | `modalEnter` + `AnimatePresence` | Overlay con `opacity: 0→0.4` |
| Drawers laterales | `slideInRight/Left` | Con `AnimatePresence` |
| KPI numbers | `useMotionValue` + `animate` | Counter de 0 a valor final |
| Gráficos de barras | `chartBarStagger` + `chartBar` | Una sola vez por scroll |
| Hover en cards | `whileHover={{ y: -2 }}` | Máx. -2px de elevación |
| Botones | `whileTap={{ scale: 0.98 }}` | Feedback táctil |
| Notificaciones | `scalePop` | Toast de éxito/error |
| Sidebar nav items | `whileHover={{ x: 2 }}` | Micro-movimiento sutil |

### 6.3 Reglas Prohibidas

- ❌ No usar `spring` con `stiffness > 400` en UI (se ve nervioso)
- ❌ No animar más de 3 propiedades simultáneamente en el mismo elemento
- ❌ No usar animaciones de loop en la interfaz principal
- ❌ No exceder `translateY(-2px)` en hover
- ❌ No usar easing `bounce` o `elastic` en componentes de negocio
- ✅ `AnimatePresence` obligatorio en cualquier cosa que monte/desmonte condicionalmente

---

## 7. MÓDULO: AUTENTICACIÓN & ONBOARDING

### 7.1 Pantallas

#### 7.1.1 Login (`/auth/login`)

**Layout:** Split screen — izquierda visual 45%, derecha formulario 55%

**Panel izquierdo (visual):**
- Fondo: `--text-1` (#1d1d1f) — la única excepción dark del diseño
- Tipografía serif italic: *"Contabilidad que piensa contigo."*
- 3 testimonios reales con avatar, nombre y empresa (carousel automático cada 5s con Framer Motion)
- Badge animado: "✓ Cumple SRI Ecuador"

**Panel derecho (formulario):**
- Logo ContaMind AI (top-left)
- H2 (sans, 600): "Bienvenido de vuelta"
- Subtext: "Ingresa a tu cuenta de ContaMind"
- Campos: Email, Contraseña (toggle visibility)
- Link: "¿Olvidaste tu contraseña?"
- CTA Primary: "Ingresar"
- Divider + "o"
- SSO buttons: Google Workspace
- Link: "¿No tienes cuenta? Empieza gratis →"

**Animaciones:**
- Panel derecho: `fadeUp` al cargar
- Formulario fields: `staggerContainer` con delay 0.1s entre campos
- Error state: shake horizontal `x: [0, -6, 6, -4, 4, 0]`

**Estados:**
- Loading: botón muestra spinner + "Ingresando..."
- Error: toast rojo + campo con border rojo
- Success: fade out + redirect con `pageTransition`

#### 7.1.2 Registro (`/auth/register`)

- Multi-step form: **3 pasos** con progress indicator (stepper)
  - **Paso 1:** Datos personales (nombre, email, contraseña)
  - **Paso 2:** Datos de empresa (razón social, RUC, industria, ciudad)
  - **Paso 3:** Plan seleccionado + certificado digital (opcional al inicio)
- Validación en tiempo real con Zod
- Paso 2: validación de RUC con el webservice del SRI (indicador "Verificando RUC..." con spinner)
- Animación entre pasos: `slideInRight` con `AnimatePresence`

#### 7.1.3 Onboarding Wizard (post-registro)

Pantalla modal overlay de bienvenida con 5 pasos configurables:

| Paso | Contenido |
|---|---|
| 1 | Bienvenida + intro ContaMind AI |
| 2 | Configurar empresa (logo, dirección, info fiscal) |
| 3 | Invitar usuarios del equipo |
| 4 | Importar datos (opcional: CSV, Excel, conectar banco) |
| 5 | Tour rápido de la interfaz (hotspots animados) |

Progress: barra top con porcentaje. Cada paso: `fadeUp`. Skip disponible en todos.

#### 7.1.4 Forgot Password & Reset

- `/auth/forgot-password`: Email input + envío de link
- `/auth/reset-password/:token`: Nueva contraseña + confirmación + validación de strength

### 7.2 Lógica de Autenticación

```tsx
// AuthStore (Zustand)
interface AuthState {
  user: User | null;
  company: Company | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

- JWT stored en `httpOnly cookie` (no localStorage)
- Refresh token automático con interceptor Axios
- Redirect al módulo principal del rol tras login
- Session timeout: modal de advertencia 2min antes, auto-logout

---

## 8. SHELL PRINCIPAL — LAYOUT & NAVEGACIÓN

### 8.1 Topbar

**Altura:** 48px  
**Fondo:** `rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px) saturate(180%)`  
**Border:** `border-bottom: 1px solid var(--border-light)` (sin shadow)  
**Position:** `sticky top-0 z-50`

**Elementos (izquierda → derecha):**

```
[Logo ContaMind]  [Breadcrumb dinámico]     [⌘K Search]  [🔔]  [?]  [Avatar]
```

- **Logo:** Wordmark + isotipo. Click → `/app/dashboard`
- **Breadcrumb:** Módulo > Subpágina > Elemento. Clickable en cada nivel.
- **⌘K Command Palette:** Buscar facturas, clientes, contactos, acciones rápidas. Implementado con `cmdk`.
- **🔔 Notificaciones:** Badge con conteo. Dropdown con lista de alertas (pagos vencidos, errores SRI, anomalías IA).
- **Avatar:** Dropdown — Perfil, Configuración, Cambiar empresa, Cerrar sesión.

**Animación topbar:** Entrada con `opacity: 0 → 1` en 200ms al cargar.

### 8.2 Sidebar (Desktop)

**Ancho:** 240px expandido / 64px colapsado (toggle persistido en localStorage)  
**Fondo:** `--white`  
**Border:** `border-right: 1px solid var(--border-light)`  
**Position:** `fixed left-0 top-[48px] h-[calc(100vh-48px)]`

**Estructura:**
```
[Selector de empresa] ←  dropdown multi-empresa

PRINCIPAL
  🏠 Dashboard
  📊 Business Intelligence

FINANZAS
  📒 Contabilidad
  🧾 Facturación
  🛒 Compras
  💰 Tesorería
  📋 Impuestos SRI

OPERACIONES
  📦 Inventario
  ⚙️ Producción
  🏷️ Activos Fijos

PERSONAS
  👥 CRM
  👤 Nómina & RRHH

AUTOMATIZACIÓN
  📄 Documentos
  🤖 IA & Automatización
  ✈️ Agente Telegram

CONFIGURACIÓN
  🔌 Integraciones
  🛡️ Seguridad
  ⚙️ Configuración
```

**Comportamiento:**
- Hover item: background `--accent-soft`, `translateX(2px)` en icon
- Active item: background `--accent-soft`, text `--accent`, border-left 2px solid `--accent`
- Grupos con label (FINANZAS, OPERACIONES...) colapsables
- Tooltip en versión colapsada (64px) con nombre del módulo
- Badge de notificación sobre ícono para alertas pendientes

**Animación sidebar:**
- Expand/collapse: `width` con `transition: 0.25s ease`
- Items: `staggerContainer` en mount inicial

### 8.3 Selector de Empresa

Dropdown en top del sidebar para multi-empresa:
```
┌─────────────────────────┐
│ 🏢 Mi Empresa S.A.      │ ← activa
│    RUC: 0987654321001   │
├─────────────────────────┤
│ + Empresa distribuidora │
│ + Agregar empresa...    │
└─────────────────────────┘
```

### 8.4 Command Palette (⌘K)

Busca en tiempo real:
- Facturas (por número, cliente, monto)
- Clientes y proveedores
- Transacciones contables
- Documentos descargados
- Acciones rápidas ("Nueva factura", "Registrar pago", "Ver balance")
- Módulos y pantallas

```
┌─────────────────────────────────────────────┐
│ 🔍 Buscar en ContaMind...                   │
├─────────────────────────────────────────────┤
│ ACCIONES RÁPIDAS                            │
│  📄 Nueva factura                    ↵      │
│  💳 Registrar pago                   ↵      │
│  👤 Nuevo cliente                    ↵      │
├─────────────────────────────────────────────┤
│ RECIENTES                                   │
│  📄 FAC-2026-001842 — Comercial Andes       │
│  📄 FAC-2026-001841 — Distribuidora XYZ     │
└─────────────────────────────────────────────┘
```

---

## 9. MÓDULO: DASHBOARD PRINCIPAL

### 9.1 Descripción

Pantalla de bienvenida y estado general del negocio. Personalizable por rol. Carga en < 1.5s.

### 9.2 Secciones

#### Header
```
Buenos días, Juan Bernardo. ← Serif, H1
Aquí está el resumen de tu empresa hoy.  ← sans, text-3
                              [Personalizar dashboard ↗]
```

#### KPI Strip — 4 cards animadas con counter

| KPI | Valor | Delta | Icono |
|---|---|---|---|
| Ventas del mes | $47,820 | +12.4% ↑ | TrendingUp |
| Facturas pendientes | 8 | -2 | FileText |
| Flujo de caja | $12,340 | +3.1% | Wallet |
| Alertas activas | 3 | — | AlertCircle (amber) |

Cada card: animación `cardItem` con stagger. El número hace counter de 0→valor en 1.2s.

Delta positivo: verde con ↑. Delta negativo: rojo con ↓.

#### Gráfico Principal — Ventas vs. Gastos (últimos 12 meses)

- `AreaChart` de Recharts con dual líneas
- Animación: líneas se dibujan de izquierda a derecha en 800ms
- Selector de periodo: 3M / 6M / 12M / YTD
- Tooltip rico: fecha, ventas, gastos, margen
- Responsive: en mobile se simplifica a últimos 3 meses

#### Panel Doble (grid 2 cols en desktop, stack en mobile)

**Columna izquierda: Actividad Reciente**
- Lista de últimas 8 transacciones
- Cada item: icono tipo + descripción + monto + fecha + badge estado
- Hover: `backgroundColor: --accent-soft`
- Footer: "Ver todas las transacciones →"

**Columna derecha: Alertas & Recomendaciones IA**
- Alertas del sistema (pagos vencidos, vencimiento de certificado SRI, etc.)
- Recomendaciones de la IA (texto corto + acción sugerida)
- Ej.: *"3 facturas del proveedor García vencen en 2 días. ¿Programar pago?"*
- CTA en cada alerta: botón ghost "Revisar"

#### Módulos de Acceso Rápido (grid 4 cols)

Cards de módulos más usados del rol. Drag-to-reorder para personalización.

#### Panel IA Insights (bottom full-width)

- Card destacada con fondo `--text-1` (dark)
- Título serif: *"Lo que la IA detectó esta semana"*
- 3 insights generados automáticamente:
  - "Las ventas los martes son 34% mayores. Considera concentrar campañas ese día."
  - "El proveedor López tiene un tiempo promedio de entrega de 4.2 días."
  - "Tu margen bruto bajó 2.1% vs. mes anterior — revisión de costos recomendada."
- Botón white: "Ver análisis completo →"

### 9.3 Personalización

Modal de personalización del dashboard:
- Toggle de widgets visibles/ocultos
- Reordenamiento drag-and-drop (Framer Motion `Reorder`)
- Selector de KPIs favoritos
- Persistido en Supabase por usuario

---

## 10. MÓDULO: CONTABILIDAD & FINANZAS

### 10.1 Páginas

#### 10.1.1 Plan de Cuentas (`/app/accounting/chart-of-accounts`)

**Layout:** Tabla jerárquica con árbol colapsable

**Funcionalidades:**
- Árbol de cuentas según NIIF/NEC ecuatoriano (5 niveles: Clase → Grupo → Cuenta → Subcuenta → Auxiliar)
- Columnas: Código | Nombre | Tipo | Naturaleza | Saldo | Acciones
- Filtros: por tipo (Activo, Pasivo, Patrimonio, Ingreso, Gasto), por nivel, búsqueda textual
- Acciones: Agregar cuenta hija, Editar, Activar/Desactivar, Ver movimientos
- Import/Export: Excel con template estándar
- Botón: "Crear cuenta" → Modal con formulario

**Animación:** Filas del árbol se expanden con `AnimatePresence` + `height: auto`

#### 10.1.2 Libro Diario (`/app/accounting/journal`)

**Tabla principal:**
- Columnas: Fecha | Número | Descripción | Debe | Haber | Estado | Acciones
- Filtros: rango de fechas, cuenta, estado (Borrador / Confirmado / Anulado)
- Búsqueda por descripción o número
- Paginación: 25/50/100 por página
- Export: PDF, Excel

**Crear/Editar Asiento:**
- Modal grande (90vh) o página dedicada
- Header: fecha, descripción, referencia, tipo
- Tabla de líneas: Cuenta (autocomplete) | Descripción | Debe | Haber
- Botón "+ Añadir línea"
- Footer: Total Debe | Total Haber | Diferencia (en rojo si ≠ 0)
- Validación: no permite guardar si asiento no cuadra
- Botones: "Guardar borrador" | "Confirmar asiento"

#### 10.1.3 Libro Mayor (`/app/accounting/ledger`)

- Selector de cuenta (autocomplete)
- Selector de período
- Tabla: Fecha | Comprobante | Descripción | Debe | Haber | Saldo
- Saldo progresivo por línea
- Export PDF con cabecera de empresa

#### 10.1.4 Estados Financieros (`/app/accounting/reports`)

Sub-módulo con 4 reportes:

| Reporte | Ruta | Descripción |
|---|---|---|
| Balance General | `/reports/balance-sheet` | Activo = Pasivo + Patrimonio |
| Estado de Resultados | `/reports/income-statement` | Ingresos - Gastos = Utilidad |
| Flujo de Efectivo | `/reports/cash-flow` | Método directo e indirecto |
| Estado de Cambios | `/reports/equity-changes` | Movimientos patrimoniales |

Cada reporte:
- Selector de período (mes, trimestre, año, personalizado)
- Comparativo período anterior (toggle)
- Vista: tabla formateada en pantalla
- Export: PDF (con logo empresa, firmado), Excel
- Compartir: link temporal de solo lectura

#### 10.1.5 Conciliación Bancaria (`/app/accounting/reconciliation`)

- Selector de cuenta bancaria
- Import de estado de cuenta (CSV/OFX del banco)
- Grid split: movimientos banco (izquierda) vs. registros ContaMind (derecha)
- Match automático por IA con confidence score
- Items no reconciliados resaltados en amber
- Acción: marcar como reconciliado, crear transacción faltante, ignorar
- Progress bar: "X de Y transacciones reconciliadas"

#### 10.1.6 Cierre de Período (`/app/accounting/closing`)

- Checklist pre-cierre: conciliaciones, depreciaciones, ajustes
- Botón "Ejecutar cierre" → confirmación modal con lista de acciones
- Historial de cierres con usuario y fecha

### 10.2 Componentes Específicos

- `AccountSelector`: autocomplete con búsqueda de cuentas
- `JournalEntryTable`: tabla editable de líneas de asiento
- `FinancialStatement`: renderer de estados financieros
- `ReconciliationGrid`: grid dividido de conciliación

---

## 11. MÓDULO: FACTURACIÓN & VENTAS

### 11.1 Páginas

#### 11.1.1 Lista de Facturas (`/app/invoicing`)

**Stats row:**
- Emitidas este mes | Cobradas | Pendientes | Vencidas

**Tabla:**
- Columnas: # | Cliente | Fecha | Vence | Subtotal | IVA | Total | Estado | Acciones
- Filtros: estado, cliente, fecha, rango de monto
- Búsqueda global
- Multi-selección + acciones masivas (enviar, anular, exportar)
- Swipe actions en mobile: Editar (azul) / Anular (rojo)

**Estados de factura con badge:**
- `Borrador` (gris) | `Autorizada` (verde) | `Enviada` (azul) | `Cobrada` (verde oscuro) | `Vencida` (rojo) | `Anulada` (gris oscuro)

#### 11.1.2 Nueva Factura / Editar (`/app/invoicing/new`)

**Formulario completo en una sola página (no wizard):**

**Sección 1 — Cabecera:**
```
[Tipo doc: Factura ▼]  [Serie: 001-001]  [Número: Automático]
[Cliente: autocomplete con búsqueda/creación rápida]
[Fecha emisión]  [Fecha vencimiento]  [Condición pago: Contado/Crédito 30/60/90]
```

**Sección 2 — Detalle de productos/servicios:**
- Tabla editable: Cantidad | Descripción/Código | P. Unitario | Descuento % | Subtotal
- Autocomplete de productos del catálogo
- Edición inline en la tabla
- Botón "+ Añadir línea" / "+ Añadir desde catálogo"

**Sección 3 — Totales:**
```
                     Subtotal:    $1,200.00
                     Descuento:   -$50.00
                     Subtotal neto: $1,150.00
                     IVA 15%:     $172.50
                     TOTAL:       $1,322.50
```

**Sección 4 — Información adicional:**
- Forma de pago (efectivo, transferencia, cheque, tarjeta)
- Información adicional / notas
- Adjuntar documentos relacionados

**Sección 5 — Retenciones (si aplica):**
- Toggle "Aplicar retención"
- Porcentaje IR / IVA
- Cálculo automático

**Acciones:**
- "Guardar borrador" (ghost)
- "Vista previa" → PDF preview en panel lateral
- "Autorizar con SRI" → envío al webservice, modal de progreso
- "Autorizar y enviar por email" → combo action

**Validaciones:**
- RUC/cédula válido
- Productos con precio > 0
- Totales correctos
- Alerta si cliente tiene facturas vencidas

#### 11.1.3 Vista de Factura (`/app/invoicing/:id`)

- Vista PDF renderizada en pantalla
- Panel lateral con historial: creación, autorización SRI, envíos, pagos
- Acciones: Imprimir, Enviar email, Registrar pago, Emitir nota de crédito, Anular
- RIDE (Representación Impresa del Documento Electrónico) descargable

#### 11.1.4 Notas de Crédito y Débito

- Flujo igual a factura pero referenciando documento original
- Motivo de la nota requerido
- Anulación parcial o total

#### 11.1.5 Cotizaciones y Órdenes de Venta

- CRUD completo de cotizaciones
- Conversión a factura con 1 clic
- Pipeline de estado: Borrador → Enviada → Aceptada → Facturada / Rechazada

#### 11.1.6 Catálogo de Productos y Servicios

- Grid de productos con búsqueda y filtros (categoría, tipo, estado)
- Ficha de producto: nombre, código, descripción, precio, IVA, unidad, stock
- Import masivo por Excel
- Categorización jerárquica

### 11.2 Integraciones en este módulo

- **SRI:** Autorización electrónica en tiempo real con feedback visual del proceso
- **Email:** Envío directo con PDF adjunto, tracking de apertura
- **WhatsApp Business (roadmap):** Envío de RIDE por WhatsApp

---

## 12. MÓDULO: COMPRAS & PROVEEDORES

### 12.1 Páginas

#### 12.1.1 Lista de Órdenes de Compra (`/app/purchasing`)

- Stats: OC abiertas, recibidas, por pagar, total del mes
- Tabla con filtros similares a facturación
- Estados: Borrador | Enviada | Confirmada | Recibida | Facturada | Cancelada

#### 12.1.2 Nueva Orden de Compra

- Formulario similar a factura de venta (proveedor en lugar de cliente)
- Sugerencia IA: "Basado en consumo histórico, sugerimos: [items]"
- Solicitud de cotización (RFQ): enviar a múltiples proveedores, comparar respuestas

#### 12.1.3 Recepción de Mercadería

- Desde OC confirmada, marcar items recibidos (total o parcial)
- Crear entrada de inventario automáticamente
- Foto de guía de remisión adjunta

#### 12.1.4 Directorio de Proveedores

- Lista con buscador
- Ficha de proveedor: datos, historial de compras, valoración, documentos
- Scoring IA: calidad, tiempo de entrega, precio competitivo

#### 12.1.5 Facturas de Proveedores

- Registro de facturas recibidas
- Matching con OC correspondiente (auto o manual)
- Validación de comprobante electrónico (consulta SRI)
- Programación de pago

---

## 13. MÓDULO: INVENTARIO & LOGÍSTICA

### 13.1 Páginas

#### 13.1.1 Dashboard de Inventario

- KPIs: Valor total stock | SKUs activos | Bajo stock | Rotación promedio
- Gráfico: distribución de stock por categoría (donut chart)
- Alerta roja: productos con stock = 0 o bajo mínimo

#### 13.1.2 Lista de Productos/Stock (`/app/inventory`)

- Grid cards o tabla (toggle de vista)
- Card de producto: imagen | nombre | SKU | stock actual | stock mínimo | ubicación | estado
- Filtros: categoría, almacén, estado (normal / bajo / agotado / exceso)
- Búsqueda por nombre, SKU, código de barras

#### 13.1.3 Movimientos de Inventario

- Tabla cronológica de entradas y salidas
- Filtros: tipo (entrada/salida/ajuste/transferencia), producto, almacén, fecha
- Cada movimiento: fecha | tipo | producto | cantidad | almacén | usuario | referencia (OC/factura)

#### 13.1.4 Gestión de Almacenes

- Lista de almacenes/ubicaciones
- Mapa visual de distribución (opcional en v2)
- Transferencias entre almacenes

#### 13.1.5 Ajustes de Inventario

- Formulario de ajuste: motivo, producto, cantidad ajustada, nueva cantidad
- Requiere aprobación de supervisor (flujo de aprobación integrado)
- Auditoría completa de ajustes

#### 13.1.6 Predicción de Demanda (IA)

- Gráfico de proyección próximos 30/60/90 días
- Recomendación de reabastecimiento: cuándo y cuánto comprar
- Basado en histórico de ventas + estacionalidad

---

## 14. MÓDULO: IMPUESTOS & CUMPLIMIENTO SRI

### 14.1 Páginas

#### 14.1.1 Dashboard de Cumplimiento (`/app/taxes`)

- Calendario fiscal del mes con próximos vencimientos
- Semáforo de estado: Declaraciones pendientes | En proceso | Presentadas
- Alertas de vencimiento próximo (7 días, 3 días, hoy)

#### 14.1.2 Declaración de IVA

- Wizard de 3 pasos:
  - **Paso 1:** Período, resumen de ventas y compras
  - **Paso 2:** Formulario 104 / 104A prellenado automáticamente
  - **Paso 3:** Revisión + generación XML + presentación simulada
- Preview del formulario tal como lo ve el SRI
- Historial de declaraciones presentadas

#### 14.1.3 Retenciones en la Fuente

- Lista de comprobantes de retención emitidos y recibidos
- Generación de retención desde factura de compra
- Resumen mensual para declaración formulario 103

#### 14.1.4 Anexos SRI

| Anexo | Descripción |
|---|---|
| ATS | Anexo Transaccional Simplificado |
| RDEP | Relación de dependencia |
| Accionistas | Información de socios |

- Generación automática del XML
- Validación pre-envío
- Historial de presentaciones

#### 14.1.5 Gestión de Certificados Digitales

- Upload del archivo `.p12`
- Password del certificado (encriptado)
- Fecha de vencimiento con alerta 30 días antes
- Test de conexión con SRI

#### 14.1.6 Consulta de Comprobantes SRI

- Validar autenticidad de comprobantes de proveedores
- Input: clave de acceso o número de comprobante
- Resultado: estado (autorizado/anulado/no existe) + datos del documento

---

## 15. MÓDULO: TESORERÍA

### 15.1 Páginas

#### 15.1.1 Dashboard de Tesorería (`/app/treasury`)

- KPIs: Saldo total bancario | Cuentas por cobrar | Cuentas por pagar | Liquidez proyectada
- Gráfico: Flujo de caja proyectado 30 días (area chart con zona positiva verde / negativa roja)
- Alertas: pagos que vencen esta semana

#### 15.1.2 Gestión de Cuentas Bancarias

- Lista de cuentas (banco, tipo, número, moneda, saldo actual)
- Saldo actualizado por sincronización bancaria o ingreso manual
- Movimientos por cuenta con búsqueda y filtros

#### 15.1.3 Programación de Pagos

- Lista de pagos programados (proveedor, monto, fecha, cuenta débito)
- Calendario de pagos (vista calendario con items por día)
- Crear pago programado: proveedor, factura vinculada, monto, fecha, método
- Aprobación de pagos (flujo multi-nivel configurable)

#### 15.1.4 Conciliación Bancaria

(Ver sección 10.1.5 — mismo componente, vinculado desde Tesorería)

#### 15.1.5 Proyección de Liquidez

- Tabla: semana a semana, próximas 8 semanas
- Columnas: Semana | Ingresos esperados | Pagos programados | Saldo proyectado
- Escenarios: optimista / base / pesimista (toggle)
- Alertas IA: "Semana del 15 mayo hay déficit proyectado de $3,200"

---

## 16. MÓDULO: COSTOS & PRODUCCIÓN

### 16.1 Páginas

#### 16.1.1 Órdenes de Producción

- Lista con estados: Planificada | En proceso | Completada | Cancelada
- Nueva orden: producto final, cantidad, fecha estimada, materias primas necesarias
- Seguimiento de avance: progress bar por orden

#### 16.1.2 Ficha de Costos

- Por producto/servicio: materiales, mano de obra directa, gastos indirectos
- Costo estándar vs. costo real (varianza)
- Histórico de evolución de costos

#### 16.1.3 Análisis de Rentabilidad

- Por producto, categoría, cliente, canal de venta
- Margen bruto y neto por ítem
- Gráfico de contribución (waterfall chart)

#### 16.1.4 Control de Desperdicios

- Registro de mermas por orden
- Reporte de desperdicio por período y categoría

---

## 17. MÓDULO: NÓMINA & RRHH

### 17.1 Páginas

#### 17.1.1 Directorio de Empleados (`/app/payroll/employees`)

- Grid de empleados: foto, nombre, cargo, departamento, estado
- Ficha de empleado: datos personales, contrato, historial salarial, vacaciones, documentos
- Indicadores: días de vacaciones disponibles, antigüedad, cumpleaños próximo

#### 17.1.2 Cálculo de Nómina (`/app/payroll/run`)

- Wizard mensual:
  - **Paso 1:** Selección de período y empleados
  - **Paso 2:** Revisión de novedades (horas extras, descuentos, bonos)
  - **Paso 3:** Preview del rol de pagos
  - **Paso 4:** Aprobación y generación de comprobantes
- Tabla de cálculo: empleado | sueldo base | horas extras | descuentos | IESS empleado | IESS patronal | neto a pagar

#### 17.1.3 Rol de Pagos

- Vista del comprobante de nómina por empleado
- Descargable en PDF firmado
- Envío por email automático a cada empleado

#### 17.1.4 Gestión de Vacaciones

- Calendario de vacaciones del equipo
- Solicitud de vacaciones: empleado solicita, jefe aprueba/rechaza
- Balance de días disponibles por empleado

#### 17.1.5 Beneficios de Ley

- Cálculo automático de:
  - Décimo tercer sueldo (mensualizado o anual)
  - Décimo cuarto sueldo
  - Fondos de reserva
  - Liquidación de haberes (al salir)
- Reporte de provisiones por período

#### 17.1.6 Integración IESS

- Generación del archivo de aportaciones (planilla IESS)
- Aviso de entrada y salida de trabajadores
- Historial de planillas presentadas

---

## 18. MÓDULO: ACTIVOS FIJOS

### 18.1 Páginas

#### 18.1.1 Registro de Activos (`/app/assets`)

- Lista: código | descripción | categoría | fecha adquisición | valor costo | depreciación acumulada | valor libro
- Ficha de activo: todos los datos + historial de movimientos + documentos de compra

#### 18.1.2 Depreciación

- Cálculo automático por método (lineal, suma de dígitos, doble saldo)
- Tabla de depreciación: mes a mes por activo
- Asiento contable de depreciación generado automáticamente
- Ejecución masiva: "Calcular depreciación del período" → confirmación → asiento

#### 18.1.3 Baja de Activos

- Formulario de baja: motivo (venta, obsolescencia, siniestro), fecha, valor de baja
- Asiento de baja generado automáticamente
- Historial de bajas

#### 18.1.4 Mantenimiento

- Registro de mantenimientos realizados por activo
- Alertas de mantenimiento preventivo (por días o uso)
- Calendario de mantenimientos próximos

---

## 19. MÓDULO: REPORTERÍA & BUSINESS INTELLIGENCE

### 19.1 Páginas

#### 19.1.1 Dashboard BI (`/app/bi`)

- **Layout:** Full-width, density controlada, gráficos grandes
- **Selector global:** Período | Empresa | Sucursal
- Grid de widgets drag-to-reorder

**Widgets disponibles:**
- Ventas vs. Presupuesto (bar chart mensual)
- Evolución de margen bruto (line chart)
- Top 10 clientes por venta (horizontal bar)
- Top 10 productos por margen (table)
- Mapa de calor de ventas por día/hora (heatmap)
- Días promedio de cobro (DSO) (gauge)
- Distribución de gastos por categoría (donut)
- Flujo de caja histórico (area chart)

#### 19.1.2 Reportes Predefinidos

Biblioteca de reportes listos:

| Categoría | Reportes |
|---|---|
| Ventas | Por cliente, por producto, por vendedor, por canal |
| Compras | Por proveedor, por categoría, comparativo |
| Financiero | P&L, Balance, Flujo de caja |
| Impuestos | IVA, Retenciones, Resúmenes SRI |
| Inventario | Kardex, rotación, valorización |
| Nómina | Nómina mensual, provisiones, IESS |

Cada reporte: filtros de período, exportar PDF/Excel, compartir link.

#### 19.1.3 Reportes Personalizados (Query Builder)

- Interfaz visual de construcción de reportes (no-code)
- Selector de módulo → campos disponibles
- Filtros, agrupaciones, ordenamientos
- Preview en tiempo real
- Guardar reporte personalizado y compartir con el equipo

#### 19.1.4 Análisis IA

- **Narrativa automática:** La IA genera un párrafo explicando los datos del período
  - *"En abril, las ventas crecieron 12% vs. marzo, impulsadas principalmente por el cliente Comercial Andes (+$4,200). Sin embargo, los gastos de logística aumentaron 8%, reduciendo el margen neto en 1.2 puntos."*
- **Anomalías detectadas:** Lista de datos atípicos con explicación
- **Proyecciones:** Forecast de ventas próximo mes con intervalos de confianza

---

## 20. MÓDULO: CRM

### 20.1 Páginas

#### 20.1.1 Dashboard CRM (`/app/crm`)

- KPIs: Leads activos | Oportunidades en pipeline | Tasa de conversión | Revenue proyectado
- Gráfico: funnel de conversión por etapa
- Lista: actividades del día (llamadas, reuniones, seguimientos pendientes)

#### 20.1.2 Pipeline de Ventas (Kanban)

- Tablero Kanban con columnas por etapa: Nuevo Lead → Contactado → Calificado → Propuesta → Negociación → Ganado / Perdido
- Cards de oportunidad: empresa, contacto, monto, probabilidad, fecha cierre
- Drag-and-drop entre columnas (Framer Motion `Reorder`)
- Filtros: vendedor, período, industria
- Vista alternativa: tabla lista

**Animación Kanban:**
- Cards: `cardItem` en mount
- Drag: elevación visual (`shadow-prominent`) + scale ligero durante drag
- Drop: flash verde en columna destino

#### 20.1.3 Directorio de Contactos

- Lista/grid de contactos con búsqueda y filtros
- Ficha de contacto 360°:
  - Datos (empresa, cargo, email, teléfono, LinkedIn)
  - Historial de interacciones (emails, llamadas, reuniones)
  - Oportunidades vinculadas
  - Facturas y transacciones
  - Notas y tareas

#### 20.1.4 Directorio de Empresas

- Similar a contactos pero a nivel empresa
- Jerarquía: empresa → contactos → oportunidades → transacciones

#### 20.1.5 Actividades & Calendario

- Vista calendario del equipo (mes/semana/día)
- Tipos de actividad: llamada, email, reunión, tarea, demo
- Crear actividad desde contacto u oportunidad
- Recordatorios con notificación push

#### 20.1.6 Campañas de Email

- Constructor de campañas básico
- Segmentación por etiqueta, industria, etapa del pipeline
- Métricas: enviados, abiertos, clicks

#### 20.1.7 Lead Scoring (IA)

- Score automático 0–100 por lead
- Factores: engagement, tamaño de empresa, industria, comportamiento
- Badge de score en cada card de oportunidad
- Sugerencia: "Contactar hoy — probabilidad de cierre 78%"

---

## 21. MÓDULO: DESCARGA DE DOCUMENTOS ELECTRÓNICOS

### 21.1 Descripción

Automatización con Playwright para descargar documentos de portales de proveedores, bancos, y el SRI sin intervención manual.

### 21.2 Páginas

#### 21.2.1 Dashboard de Descargas (`/app/documents`)

- KPIs: Documentos descargados este mes | Exitosas | Con errores | Pendientes
- Lista de trabajos de descarga recientes con estado

#### 21.2.2 Configuración de Fuentes

- Lista de fuentes configuradas (banco X, portal proveedor Y, SRI)
- Nueva fuente: tipo (banco / SRI / proveedor) + URL + credenciales (encriptadas) + frecuencia de sincronización
- Estado de conexión: ✅ Activa | ⚠️ Error de credenciales | 🔄 Sincronizando

**UI de credenciales:**
- Password field con toggle de visibilidad
- Encriptación visual: "🔒 Credenciales encriptadas con AES-256"
- Test de conexión → "Conectando..." → resultado con detalle

#### 21.2.3 Historial de Descargas

- Tabla: Fecha | Fuente | Documentos descargados | Estado | Duración | Errores
- Filtros: fuente, estado, fecha
- Detalle de error (expandible): screenshot del error (si Playwright lo capturó), mensaje, reintentos

#### 21.2.4 Repositorio de Documentos

- Grid de documentos descargados: tipo | fuente | fecha | empresa/banco | acciones
- Vista previa inline (PDF viewer)
- Asociación: vincular documento a transacción contable (manual o auto por IA)
- Búsqueda por contenido (OCR indexado)

#### 21.2.5 Programación de Sincronización

- Scheduler visual: frecuencia (diaria, semanal, mensual) por fuente
- Logs de ejecución en tiempo real (WebSocket)
- Botón "Ejecutar ahora" por fuente

### 21.3 UX de Proceso en Curso

Cuando Playwright está ejecutando:
```
┌─────────────────────────────────────────┐
│ 🤖 Sincronizando Banco Pichincha        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━░░░░  68%       │
│ Descargando estado de cuenta enero...   │
│                          [Cancelar]     │
└─────────────────────────────────────────┘
```
Progress bar animado con Framer Motion. Log de pasos en tiempo real.

---

## 22. MÓDULO: AGENTE IA EN TELEGRAM

### 22.1 Páginas

#### 22.1.1 Centro de Configuración (`/app/telegram`)

**Layout:** Pantalla tipo "producto" con ilustración del bot a la derecha

**Panel de conexión:**
- Estado: Conectado ✅ / No conectado
- Botón "Conectar con Telegram" → genera código de 6 dígitos → QR code para vincular cuenta
- Instrucciones paso a paso animadas

**Configuración de usuarios:**
- Lista de usuarios de Telegram vinculados con sus roles ContaMind
- Agregar/remover usuarios
- Permisos por usuario: qué puede consultar y aprobar

#### 22.1.2 Comandos Disponibles

**Tabla de referencia de comandos:**

| Comando | Descripción | Permisos |
|---|---|---|
| `/balance` | Saldo de cuentas bancarias | Gerente |
| `/ventas_hoy` | Resumen de ventas del día | Gerente, Vendedor |
| `/pendientes` | Facturas por cobrar/pagar | Contador, Gerente |
| `/aprobar [id]` | Aprobar pago o compra | Gerente |
| `/rechazar [id]` | Rechazar solicitud | Gerente |
| `/reporte` | Resumen financiero del período | Gerente |
| `/alerta` | Ver alertas activas | Todos |
| `/ayuda` | Lista de comandos disponibles | Todos |

#### 22.1.3 Historial de Conversaciones

- Log de mensajes del bot con cada usuario
- Filtro por usuario y fecha
- Exportable

#### 22.1.4 Notificaciones Automáticas Configuradas

- Lista de triggers de notificación (factura autorizada, pago vencido, anomalía detectada)
- Toggle activar/desactivar por trigger
- Preview del mensaje que se enviará

#### 22.1.5 Simulador de Bot (Test)

- Widget inline tipo chat para testear el bot sin salir de la app
- Input de texto → respuesta del agente en tiempo real
- Useful para onboarding y pruebas de config

**UI del simulador:**
```
┌─────────────────────────────────────┐
│  ContaMind Bot 🤖                   │
│ ─────────────────────────────────── │
│                  /balance           │
│  💰 Saldo actual:                   │
│  Banco Pichincha (cte): $12,450.00  │
│  Banco Guayaquil (aho): $3,200.00   │
│  ─────────────────────────────────  │
│  Total: $15,650.00                  │
│ ─────────────────────────────────── │
│ [Escribe un comando...]      [→]    │
└─────────────────────────────────────┘
```

---

## 23. MÓDULO: IA & AUTOMATIZACIÓN

### 23.1 Páginas

#### 23.1.1 Centro de IA (`/app/ai`)

**Layout hero:** Fondo `--text-1`, título serif italic, descripción del asistente

**Chat con el Asistente Contable IA:**
- Interfaz de chat full-featured
- Historial de conversación persistido
- Sugerencias de preguntas frecuentes (chips clickables)
- El asistente tiene contexto de los datos de la empresa
- Respuestas con datos reales: tablas, gráficos embebidos en el chat
- Markdown rendering en respuestas

**Ejemplos de preguntas:**
- *"¿Cuáles son mis 5 clientes más rentables este año?"*
- *"¿Qué facturas están próximas a vencer esta semana?"*
- *"Explícame el asiento del cierre de IVA de marzo"*
- *"¿Cuánto debo reservar para el décimo tercer sueldo?"*

#### 23.1.2 Automatizaciones (`/app/ai/automations`)

- Lista de automatizaciones activas/inactivas
- Crear automatización: trigger + condición + acción (no-code con Framer Motion en el builder)
- Ejemplos de automatizaciones:
  - "Cuando una factura vence → enviar email al cliente"
  - "Cuando stock < mínimo → crear OC al proveedor preferido"
  - "Cuando se detecta gasto anómalo → notificar en Telegram"

**Builder visual de automatizaciones:**
```
[TRIGGER: Factura vencida]
        ↓
[CONDICIÓN: Monto > $500]
        ↓
[ACCIÓN: Enviar email]  [ACCIÓN: Notificar Telegram]
```

Cards conectadas con líneas animadas (SVG).

#### 23.1.3 Detección de Fraude & Anomalías

- Lista de anomalías detectadas con nivel de riesgo (alto/medio/bajo)
- Cada anomalía: descripción, datos sospechosos, acción recomendada
- "Marcar como falso positivo" o "Investigar"
- Historial de anomalías resueltas

#### 23.1.4 Predicciones & Forecasting

- Ventas próximos 3 meses (con intervalos de confianza)
- Morosidad: lista de clientes con score de riesgo de no pago
- Cash flow proyectado con IA
- Todas las predicciones con explicación del modelo

---

## 24. MÓDULO: INTEGRACIONES & APIS

### 24.1 Páginas

#### 24.1.1 Hub de Integraciones (`/app/integrations`)

**Layout tipo "App Store" — grid de cards de integraciones:**

| Categoría | Integraciones |
|---|---|
| Banca | Banco Pichincha, Banco Guayaquil, Produbanco, Banco del Pacífico |
| Pagos | Payphone, PlacetoPay, Kushki |
| E-commerce | WooCommerce, Shopify |
| Comunicación | Gmail, Outlook, WhatsApp Business |
| Logística | Servientrega, Laar Courier |
| Gobierno | SRI, IESS, BCE |
| Productividad | Google Workspace, Microsoft 365 |

Card de integración: logo + nombre + descripción + estado (conectado / disponible) + botón.

#### 24.1.2 API Keys (`/app/integrations/api-keys`)

- Lista de API keys generadas (nombre, fecha creación, último uso, permisos)
- Crear nueva key: nombre, scopes de acceso, expiración
- Revocar key con confirmación
- Documentación de la API (link a docs externas)

#### 24.1.3 Webhooks

- Lista de webhooks configurados: evento, URL destino, estado, último disparo
- Crear webhook: selección de eventos, URL, secret para validación
- Logs de envíos: éxito, fallo, payload, respuesta
- Botón "Reenviar" para fallos

#### 24.1.4 Importar / Exportar Datos

- Importar: clientes, proveedores, productos, asientos contables
- Templates descargables en Excel
- Validación pre-import con preview de errores
- Exportar: todos los módulos en CSV/Excel/JSON

---

## 25. MÓDULO: SEGURIDAD & ADMINISTRACIÓN

### 25.1 Páginas

#### 25.1.1 Gestión de Usuarios (`/app/admin/users`)

- Lista de usuarios: avatar | nombre | email | rol | último acceso | estado
- Invite user: email + rol → envío de invitación
- Editar usuario: nombre, rol, permisos granulares por módulo
- Desactivar/reactivar usuario
- Historial de accesos por usuario

#### 25.1.2 Roles & Permisos

- Lista de roles (predefinidos + personalizados)
- Matriz de permisos: módulo × acción (ver / crear / editar / eliminar / aprobar)
- Crear rol personalizado con nombre y descripción
- Asignar rol a usuarios

**UI Matriz de permisos:**
```
                 Ver  Crear  Editar  Eliminar  Aprobar
Facturación       ✅    ✅     ✅       ❌        ❌
Contabilidad      ✅    ✅     ✅       ❌        ✅
Nómina            ✅    ❌     ❌       ❌        ❌
...
```

Toggle switches animados para cada permiso.

#### 25.1.3 Logs de Auditoría (`/app/admin/audit`)

- Timeline de todas las acciones del sistema: quién, qué, cuándo, desde dónde
- Filtros: usuario, módulo, tipo de acción, fecha
- Exportable para auditoría externa
- Retención: últimos 12 meses visible, archivo histórico descargable

#### 25.1.4 Seguridad de Cuenta (`/app/admin/security`)

- Configuración de 2FA: TOTP (Google Authenticator) o SMS
- Política de contraseñas
- Session management: ver sesiones activas, cerrar remotamente
- IP allowlist (opcional)
- Alertas de seguridad: logins desde IPs nuevas, cambios de contraseña

#### 25.1.5 Planes & Facturación (Meta)

- Plan actual con features incluidas
- Uso del plan: usuarios, empresas, documentos/mes
- Upgrade/downgrade de plan
- Historial de pagos de suscripción

---

## 26. MÓDULO: CONFIGURACIÓN DE EMPRESA

### 26.1 Páginas

#### 26.1.1 Información General (`/app/settings/company`)

- Logo de la empresa (upload con crop)
- Razón social, RUC, nombre comercial
- Dirección, teléfono, email, sitio web
- Tipo de contribuyente (obligado a llevar contabilidad / no obligado)
- Régimen tributario
- Actividad económica (CIIU)

#### 26.1.2 Configuración Contable

- Método contable (devengado / caja)
- Período fiscal (enero–diciembre u otro)
- Moneda funcional (USD para Ecuador)
- Configuración de cuentas por defecto (ventas, compras, caja, etc.)
- Numeración de comprobantes (serie, inicio)

#### 26.1.3 Configuración de Facturación Electrónica

- Ambiente SRI: Pruebas / Producción
- Datos del emisor (para el XML)
- Certificado digital activo
- Logo para el RIDE
- Pie de página de facturas

#### 26.1.4 Notificaciones & Alertas

- Configurar alertas por evento (toggle on/off)
- Canal de notificación por alerta: email / in-app / Telegram
- Resumen diario: hora de envío, destinatarios

#### 26.1.5 Personalización de la Interfaz

- Módulos visibles en el sidebar (ocultar los no usados)
- Nombre personalizado para módulos
- Idioma (ES por ahora, EN roadmap)

---

## 27. COMPONENTES GLOBALES REUTILIZABLES

### 27.1 Catálogo de Componentes

#### DataTable
```tsx
// @tanstack/react-table con features:
// - Sorting, filtering, pagination
// - Column resize
// - Row selection (multi)
// - Sticky header
// - Mobile responsive (cards)
// - Export CSV/Excel
// - Loading skeleton
// - Empty state
<DataTable
  columns={columns}
  data={data}
  searchable
  exportable
  selectable
/>
```

#### KPICard
```tsx
// Card de métrica con animación de counter
<KPICard
  label="Ventas del mes"
  value={47820}
  format="currency"
  delta={12.4}
  deltaType="increase"
  icon={TrendingUp}
/>
```

#### PageHeader
```tsx
// Encabezado estándar de página
<PageHeader
  label="FINANZAS"
  title="Facturación"
  description="Gestiona tus facturas electrónicas"
  actions={<Button variant="primary">Nueva factura</Button>}
/>
```

#### FilterBar
```tsx
// Barra de filtros con chips
<FilterBar
  filters={[
    { id: 'status', label: 'Estado', options: [...] },
    { id: 'date', label: 'Fecha', type: 'daterange' },
  ]}
  onFilterChange={handleFilter}
/>
```

#### EmptyState
```tsx
// Para tablas y listas sin datos
<EmptyState
  icon={FileText}
  title="Sin facturas aún"
  description="Crea tu primera factura electrónica"
  action={<Button>Nueva factura</Button>}
/>
```

#### ConfirmModal
```tsx
// Modal de confirmación para acciones destructivas
<ConfirmModal
  title="¿Anular factura?"
  description="Esta acción no se puede deshacer."
  confirmLabel="Sí, anular"
  variant="danger"
  onConfirm={handleAnular}
/>
```

#### LoadingSkeleton
```tsx
// Skeletons animados para estados de carga
// Variantes: card, table, list, kpi
<LoadingSkeleton variant="table" rows={8} />
```

#### PDF Viewer (inline)
```tsx
// Visualizador de PDF sin salir de la app
<PDFViewer
  url={documentUrl}
  height="80vh"
  showToolbar
/>
```

#### DateRangePicker
```tsx
// Selector de rango de fechas con presets
// Presets: Hoy, Esta semana, Este mes, Trimestre, Año
<DateRangePicker
  presets={standardPresets}
  onChange={handleDateChange}
/>
```

#### ChartContainer
```tsx
// Wrapper para gráficos de Recharts con:
// - Loading state
// - Empty state
// - Responsive wrapper
// - Export image
<ChartContainer title="Ventas mensuales" exportable>
  <BarChart data={data} />
</ChartContainer>
```

#### StatusBadge
```tsx
// Badge de estado semántico
<StatusBadge status="authorized" /> // ✅ Autorizada
<StatusBadge status="pending" />    // ⏳ Pendiente
<StatusBadge status="overdue" />    // 🔴 Vencida
```

#### SearchInput
```tsx
// Input de búsqueda con debounce y clear
<SearchInput
  placeholder="Buscar facturas..."
  onSearch={handleSearch}
  debounce={300}
/>
```

#### RUCInput
```tsx
// Input validador de RUC ecuatoriano
// Validación en tiempo real + consulta SRI
<RUCInput
  onValidated={(rucData) => fillForm(rucData)}
/>
```

#### CurrencyInput
```tsx
// Input de moneda con formato automático
<CurrencyInput
  currency="USD"
  value={amount}
  onChange={setAmount}
/>
```

#### FileUpload
```tsx
// Drag & drop + browse + preview
<FileUpload
  accept=".pdf,.xml,.p12"
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={handleUpload}
/>
```

---

## 28. ESTADOS GLOBALES & FEEDBACK AL USUARIO

### 28.1 Toast Notifications (Sonner)

```tsx
// Posición: bottom-right
// Duración: 4s (success), 6s (error), indefinido (loading)
toast.success('Factura autorizada exitosamente');
toast.error('Error al conectar con el SRI');
toast.loading('Autorizando con SRI...');
toast.promise(authorizeSRI(), {
  loading: 'Enviando al SRI...',
  success: 'Factura autorizada',
  error: 'Error de autorización',
});
```

### 28.2 Loading States

**Estrategia:** Optimistic UI donde sea posible, skeleton en carga inicial.

| Contexto | Loader |
|---|---|
| Carga de página | Skeleton de la estructura completa |
| Tabla cargando | Skeleton de filas (8 filas) |
| Botón en acción | Spinner inline + texto "..." |
| Operación larga (SRI, Playwright) | Progress bar con steps |
| Modal loading | Overlay + spinner centrado |

### 28.3 Error States

```tsx
// Error de red
<ErrorState
  type="network"
  message="Sin conexión a internet"
  retry={refetch}
/>

// Error de API
<ErrorState
  type="server"
  message="Error del servidor. Intenta de nuevo."
  retry={refetch}
/>

// Error de permisos
<ErrorState
  type="permission"
  message="No tienes acceso a este módulo"
  action="Contacta al administrador"
/>
```

### 28.4 Confirmaciones de Acciones Críticas

Acciones destructivas o irreversibles requieren siempre:
1. Modal de confirmación con descripción clara del impacto
2. Para acciones muy críticas (anular declaración SRI, eliminar empresa): escribir el texto de confirmación manualmente

### 28.5 Offline Indicator

Banner top cuando no hay conexión:
```
⚠️ Sin conexión a internet — Los cambios se sincronizarán cuando se restablezca la conexión
```

---

## 29. ACCESIBILIDAD (a11y)

### 29.1 Estándares

- **WCAG 2.1 AA** como mínimo en todos los componentes
- Contraste de color: mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Todos los elementos interactivos accesibles por teclado
- Foco visible en todos los elementos

### 29.2 Implementación

```tsx
// Roles ARIA en componentes complejos
<nav aria-label="Navegación principal">
<button aria-expanded={isOpen} aria-controls="dropdown-id">
<table role="grid" aria-label="Lista de facturas">
<div role="status" aria-live="polite">{statusMessage}</div>

// Labels en formularios
<label htmlFor="ruc-input">RUC del cliente</label>
<input id="ruc-input" aria-describedby="ruc-help" />
<span id="ruc-help">Ingresa el RUC de 13 dígitos</span>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Saltar al contenido principal
</a>
```

### 29.3 Navegación por Teclado

- `Tab` / `Shift+Tab`: navegar elementos
- `Enter` / `Space`: activar controles
- `Escape`: cerrar modales, dropdowns
- `Arrow keys`: navegar en menús y tablas
- `⌘K`: abrir command palette

### 29.4 Preferencias del Sistema

```css
/* Respetar prefer-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

En Framer Motion: usar `useReducedMotion()` hook para deshabilitar animaciones.

---

## 30. PERFORMANCE & OPTIMIZACIÓN

### 30.1 Code Splitting

```tsx
// Lazy loading por módulo
const Accounting = lazy(() => import('@/modules/accounting'));
const Invoicing  = lazy(() => import('@/modules/invoicing'));
const CRM        = lazy(() => import('@/modules/crm'));

// Suspense wrapper con skeleton
<Suspense fallback={<ModuleSkeleton />}>
  <Accounting />
</Suspense>
```

### 30.2 Targets de Performance (Core Web Vitals)

| Métrica | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Bundle size (inicial) | < 200KB gzipped |

### 30.3 Estrategias

- **TanStack Query:** Cache de server state, re-fetch inteligente, stale-while-revalidate
- **Imágenes:** WebP + lazy loading + `next/image` o `@unpic/react`
- **Fuentes:** `font-display: swap` + preload de Geist y Instrument Serif
- **Listas largas:** Virtualización con `@tanstack/react-virtual` para tablas > 100 filas
- **Datos de dashboards:** Preload en background al login (prefetch de KPIs)
- **Service Worker:** Cache de assets estáticos

### 30.4 Monitoring

- **Sentry:** Error tracking frontend
- **Posthog / Mixpanel:** Analytics de producto (funnels, session recording opt-in)
- **Web Vitals:** Reporte automático a analytics

### 30.5 SEO (App Shell)

Aunque es un SaaS autenticado, las páginas públicas (login, landing, docs) deben tener:
- Meta tags correctos
- OG tags para compartir
- sitemap.xml para páginas públicas

---

## APÉNDICE A — MOCKUP TEXTUAL: PÁGINA DE FACTURACIÓN

```
┌──────────────────────────────────────────────────────────────────────┐
│  ContaMind AI                         ⌘K    🔔²   ❓   JB ▾          │  ← Topbar blur
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                          │
│  🏠 Dash   │  [FACTURACIÓN]                                          │  ← Section label 0.72rem
│            │  Facturación                     [+ Nueva factura]      │  ← H1 Serif + CTA
│  📒 Conta  │                                                          │
│  🧾 Facturas│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  🛒 Compras│  │ Emitidas │  │ Cobradas │  │Pendientes│  │ Vencidas ││
│  💰 Tesore │  │   $84,200│  │  $61,500 │  │  $18,400 │  │   $4,300 ││
│            │  │ +12% ↑   │  │ +8% ↑   │  │  8 docs  │  │  3 docs  ││
│  📦 Invent │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│  👥 CRM    │                                                          │
│  🤖 IA     │  [Buscar facturas...]  [Estado ▾]  [Fecha ▾]  [Cliente ▾]│
│            │                                                          │
│  ─────     │  ┌────────────────────────────────────────────────────┐ │
│  ⚙️ Config │  │ #      Cliente          Fecha    Total   Estado    │ │
│            │  ├────────────────────────────────────────────────────┤ │
│            │  │ 001842 Comercial Andes  01/05   $1,322  ✅ Cobrada │ │
│            │  │ 001841 Distribuidora XZ 30/04   $4,180  🟡 Enviada │ │
│            │  │ 001840 Tech Solutions   28/04   $890    🔴 Vencida │ │
│            │  │ 001839 García & Asoc.   25/04   $2,100  ✅ Cobrada │ │
│            │  └────────────────────────────────────────────────────┘ │
│            │  Mostrando 1–25 de 142 facturas   [< 1 2 3 ... 6 >]   │
└────────────┴─────────────────────────────────────────────────────────┘
```

---

## APÉNDICE B — MOCKUP TEXTUAL: NUEVA FACTURA

```
┌──────────────────────────────────────────────────────────────────────┐
│  Nueva Factura                                          [Vista previa]│
├────────────────────────────────────────────────────────┬─────────────┤
│                                                        │   PDF       │
│  DATOS DEL EMISOR                                      │   PREVIEW   │
│  ┌──────────────────────────────────────────────────┐  │             │
│  │ Tipo: [Factura ▾]  Serie: [001-001]  Nro: Auto  │  │  ┌────────┐ │
│  └──────────────────────────────────────────────────┘  │  │ RIDE   │ │
│                                                        │  │ Preview│ │
│  CLIENTE                                               │  │        │ │
│  ┌──────────────────────────────────────────────────┐  │  └────────┘ │
│  │ RUC/Cédula: [____________] 🔍 Verificando...     │  │             │
│  │ Razón Social: [Comercial Andes S.A.          ]   │  │             │
│  │ Email: [____________________]                     │  │             │
│  └──────────────────────────────────────────────────┘  │             │
│                                                        │             │
│  DETALLE                                               │             │
│  ┌────┬──────────────────┬────────┬──────┬───────────┐ │             │
│  │ #  │ Descripción       │ Cant.  │P.Unit│  Subtotal │ │             │
│  ├────┼──────────────────┼────────┼──────┼───────────┤ │             │
│  │  1 │ Servicio consul...│   1.00 │800.00│   $800.00 │ │             │
│  │  2 │ Licencia anual    │   1.00 │400.00│   $400.00 │ │             │
│  ├────┴──────────────────┴────────┴──────┴───────────┤ │             │
│  │ [+ Añadir línea]                                  │ │             │
│  └───────────────────────────────────────────────────┘ │             │
│                                        Subtotal: $1,200│             │
│                                        IVA 15%:  $180  │             │
│                                        TOTAL:   $1,380 │             │
│                                                        │             │
│  [Guardar borrador]  [Vista previa]  [Autorizar SRI →] │             │
└────────────────────────────────────────────────────────┴─────────────┘
```

---

## APÉNDICE C — ANIMACIONES POR MÓDULO (RESUMEN)

| Módulo | Animación clave |
|---|---|
| Login | `fadeUp` en form + shake en error |
| Dashboard | Counter animado en KPIs + `staggerContainer` en cards |
| Facturación | `pageTransition` + slide in modal de nueva factura |
| Kanban CRM | `Reorder` drag-and-drop con elevación de card |
| Documentos Playwright | Progress bar con WebSocket en tiempo real |
| Agente Telegram | Chat con `fadeUp` en cada mensaje |
| BI Charts | Stagger de barras en primer viewport |
| Onboarding | `slideInRight` entre pasos del wizard |

---

*Documento generado: Mayo 2026 — ContaMind AI v1.0*
*Próxima revisión: Tras aprobación de stakeholders y antes de inicio de desarrollo*
