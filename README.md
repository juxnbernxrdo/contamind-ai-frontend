# ContaMind AI Frontend

**ContaMind** es una plataforma de contabilidad e inteligencia artificial diseñada para automatizar la gestión financiera de PyMEs. Este repositorio contiene el frontend construido con **Next.js 15**, enfocado en proporcionar una experiencia de usuario moderna, rápida y fluida.

## 🚀 Características Principales

- **Módulo Financiero NIIF:** Plan de cuentas, cierres, asientos automáticos y estados financieros integrados.
- **Facturación Electrónica (SRI):** Autorización instantánea y gestión de comprobantes recibidos.
- **IA Financiera:** Procesamiento de lenguaje natural para asientos contables y análisis predictivo de solvencia.
- **Gestión de Cartera:** Control exhaustivo de cuentas por cobrar y pagar.
- **Nómina Automatizada:** Cálculos de ley, descuentos IESS y roles de pago.
- **Cumplimiento Tributario:** Generación automática de formularios 104, 103 y anexos transaccionales (ATS).

## 🛠️ Tecnologías

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Animaciones:** [Motion](https://motion.dev/) (Framer Motion)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **IA:** Integración con Google Gemini via `@google/genai`

## 📁 Estructura del Proyecto

```text
├── app/              # Rutas y páginas (App Router)
│   ├── api-docs/     # Documentación técnica
│   ├── blog/         # Artículos y novedades
│   ├── nosotros/     # Información de la empresa
│   └── ...           # Módulos de marketing y producto
├── components/       # Componentes de UI reutilizables
├── hooks/            # Hooks personalizados (p.ej. use-mobile)
├── lib/              # Utilidades y configuraciones
└── public/           # Activos estáticos
```

## 💻 Configuración Local

### Prerrequisitos

- Node.js 20+
- NPM o PNPM

### Pasos para ejecutar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/contamind-ai-frontend.git
   cd contamind-ai-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` basado en `.env.example` y añade tu `GEMINI_API_KEY`.
   ```bash
   cp .env.example .env.local
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📄 Licencia

Este proyecto es privado. Para más información, contactar con el equipo de [ContaMind](https://contamind.ai).
