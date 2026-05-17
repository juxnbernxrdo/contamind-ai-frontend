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
| TypeScript | 5.7+ | Type safety (Full Stack) |
| NestJS | 11.x | Backend (Real Source of Truth) |
| Vite | 6.x | Build tool |
| React Router v7 | 7.x | Routing SPA |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 11.x | Animaciones y transiciones |
| Zustand | 5.x | State management global |
| TanStack Query | 5.x | Server state, caching, sync |
| Axios | 1.x | HTTP client con interceptors y Mutex de refresco |

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
├── modules/                # Un folder por módulo de negocio (Sincronizado con DTOs de NestJS)
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
│   ├── services/           # API calls (Axios instances)
│   ├── utils/              # Helpers, formatters
│   └── types/              # TypeScript interfaces (derivadas de NestJS DTOs)
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
├── types/                  # Tipos específicos (DTO alignment)
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

### 4.4 Guards de Autenticación y Permisos (Integración NestJS)

```tsx
// ProtectedRoute: verifica JWT válido y sesión activa
// RoleGuard: verifica permisos específicos enforcing NestJS RBAC/ABAC
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
- Validación en tiempo real con Zod (sincronizada con NestJS DTOs)
- Paso 2: validación de RUC con el webservice del SRI vía backend NestJS
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

### 7.2 Arquitectura de Autenticación & Backend (NestJS)

- **Refresh Token:** Gestionado exclusivamente como `httpOnly cookie` por **NestJS** para máxima seguridad contra ataques XSS.
- **Access Token:** Almacenado estrictamente en memoria (Zustand state) para evitar persistencia vulnerable en el cliente.
- **DTOs (Data Transfer Objects):** Comunicación basada en interfaces compartidas y DTOs de NestJS, asegurando consistencia de datos y validaciones `class-validator` / `class-transformer`.
- **Guards & Interceptors:** Implementación de NestJS Guards en el servidor para protección de rutas y validación de permisos en tiempo real. Interceptores de NestJS para normalización de errores y respuestas.
- **Refresh automático:** El frontend utiliza un interceptor de Axios para capturar errores 401 y disparar el flujo de refresh token (cookie-based) sin interrupción de la experiencia del usuario.
- **Validación:** Uso de `class-validator` en el backend NestJS, sincronizado con las validaciones de `Zod` en el frontend para una capa doble de seguridad.

```tsx
// AuthStore (Zustand)
interface AuthState {
  user: User | null;
  accessToken: string | null; // Strict memory storage
  company: Company | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

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

---

## 9. MÓDULO: DASHBOARD PRINCIPAL

### 9.1 Descripción

Pantalla de bienvenida y estado general del negocio. Personalizable por rol. Carga en < 1.5s gracias al caching agresivo en NestJS.

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

#### Gráfico Principal — Ventas vs. Gastos (últimos 12 meses)

- `AreaChart` de Recharts con dual líneas
- Animación: líneas se dibujan de izquierda a derecha en 800ms
- Selector de periodo: 3M / 6M / 12M / YTD
- Tooltip rico: fecha, ventas, gastos, margen

---

## 10. MÓDULO: CONTABILIDAD & FINANZAS

### 10.1 Páginas

#### 10.1.1 Plan de Cuentas (`/app/accounting/chart-of-accounts`)

**Layout:** Tabla jerárquica con árbol colapsable. Datos servidos por NestJS con soporte para grandes árboles.

**Funcionalidades:**
- Árbol de cuentas según NIIF/NEC ecuatoriano (5 niveles: Clase → Grupo → Cuenta → Subcuenta → Auxiliar)
- Columnas: Código | Nombre | Tipo | Naturaleza | Saldo | Acciones
- Filtros: por tipo, por nivel, búsqueda textual
- Acciones: Agregar cuenta hija, Editar, Activar/Desactivar, Ver movimientos

#### 10.1.2 Libro Diario (`/app/accounting/journal`)

**Tabla principal:**
- Columnas: Fecha | Número | Descripción | Debe | Haber | Estado | Acciones
- Filtros: rango de fechas, cuenta, estado (Borrador / Confirmado / Anulado)
- Paginación gestionada en backend (NestJS typeorm-pagination)

---

## 11. MÓDULO: FACTURACIÓN & VENTAS

### 11.1 Páginas

#### 11.1.1 Lista de Facturas (`/app/invoicing`)

**Stats row:**
- Emitidas este mes | Cobradas | Pendientes | Vencidas

**Tabla:**
- Columnas: # | Cliente | Fecha | Vence | Subtotal | IVA | Total | Estado | Acciones
- Filtros avanzados sincronizados con NestJS Query params.

#### 11.1.2 Nueva Factura / Editar (`/app/invoicing/new`)

**Formulario completo en una sola página:**
- Validación de RUC en tiempo real (NestJS Service → SRI Service)
- Autocomplete de productos con búsqueda predictiva
- Cálculo de impuestos automático en el cliente con validación en el servidor
- Generación de RIDE (PDF) asíncrona vía NestJS Workers.

---

## 21. MÓDULO: DESCARGA DE DOCUMENTOS ELECTRÓNICOS

### 21.1 Descripción

Automatización gestionada por **NestJS Playwright Workers** para descargar documentos de portales de proveedores, bancos, y el SRI sin intervención manual.

### 21.2 Páginas

#### 21.2.1 Dashboard de Descargas (`/app/documents`)

- KPIs: Documentos descargados este mes | Exitosas | Con errores | Pendientes
- Lista de trabajos de descarga recientes con estado en tiempo real vía NestJS WebSockets.

#### 21.2.2 Configuración de Fuentes

- Credenciales encriptadas en reposo (NestJS Encryption Module)
- Estado de conexión: ✅ Activa | ⚠️ Error | 🔄 Sincronizando

---

## 22. MÓDULO: AGENTE IA EN TELEGRAM

### 22.1 Centro de Configuración (`/app/telegram`)

**Layout:** Pantalla tipo "producto" con ilustración del bot a la derecha.

- **NestJS Telegram Engine:** El backend gestiona el ciclo de vida del bot y el ruteo de comandos.
- **WebSockets:** Notificaciones en tiempo real en el frontend cuando el bot recibe un comando.
- **Simulador de Bot:** Widget para pruebas rápidas de comandos.

---

## 23. MÓDULO: IA & AUTOMATIZACIÓN

### 23.1 Centro de IA (`/app/ai`)

- **NestJS AI Module:** Integración con LLMs (OpenAI/Anthropic) con streaming de respuestas (Server-Sent Events).
- **Context Aware:** El asistente tiene acceso a los DTOs de la empresa para responder preguntas específicas sobre sus finanzas.
- **Detección de Anomalías:** Algoritmos en NestJS que analizan transacciones atípicas.

---

## 25. MÓDULO: SEGURIDAD & ADMINISTRACIÓN

### 25.1 Gestión de Usuarios & RBAC

- **NestJS Guards:** Protección rígida de endpoints basada en roles y permisos granulares.
- **Logs de Auditoría:** Historial inmutable de acciones críticas (Quién, Qué, Cuándo).
- **Sesiones:** Control de sesiones activas con revocación remota.

---

## 27. COMPONENTES GLOBALES REUTILIZABLES

### 27.1 Catálogo de Componentes

#### DataTable
```tsx
// @tanstack/react-table con Server-side operations (NestJS integration)
<DataTable
  columns={columns}
  data={data}
  serverSide
  onStateChange={handleServerState}
/>
```

#### StatusBadge
```tsx
// Badge de estado semántico mapeado a enums de NestJS
<StatusBadge status={invoiceStatus} />
```

---

## 28. ESTADOS GLOBALES & FEEDBACK AL USUARIO

### 28.1 Toast Notifications (Sonner)

```tsx
// Manejo centralizado de errores de NestJS
toast.error(error.message || 'Error inesperado del servidor');
```

### 28.2 Loading States

**Estrategia:** Optimistic UI donde sea posible, skeletons en carga inicial. NestJS pre-fetching para datos críticos.

---

## 30. PERFORMANCE & OPTIMIZACIÓN

### 30.1 Code Splitting & Modularization
- Lazy loading por módulo.
- Landing page modularizada en Server Components.
- NestJS caching (Redis) para respuestas frecuentes.

### 30.2 Monitoring & Testing
- **Playwright:** Suite de pruebas E2E para flujos críticos (Auth, 404, Back Navigation).
- **Sentry:** Error tracking (Frontend + NestJS).
- **Posthog:** Analytics de producto.

---

*Documento generado: Mayo 2026 — ContaMind AI v1.0 (NestJS Core)*
Documento generado: Mayo 2026 — ContaMind AI v1.0 (NestJS Core)*
