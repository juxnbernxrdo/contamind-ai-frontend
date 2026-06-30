import {
  // Principal
  LayoutDashboard,
  Activity,
  Inbox,
  Bell,
  Calendar,
  // IA Empresarial
  BrainCircuit,
  Bot,
  Zap,
  GitBranch,
  FileCode,
  Library,
  Database,
  BookMarked,
  // Contabilidad
  BookOpen,
  ListTree,
  Receipt,
  BookText,
  ScrollText,
  Scale,
  BarChart3,
  Building2,
  Landmark,
  TrendingDown,
  RefreshCcw,
  // Facturación
  FileText,
  FileInput,
  FileMinus,
  FilePlus,
  Percent,
  FileCheck,
  Printer,
  CircleDollarSign,
  CreditCard,
  Repeat,
  // Finanzas
  Vault,
  ArrowLeftRight,
  TrendingUp,
  PiggyBank,
  Target,
  LineChart,
  BadgeAlert,
  Briefcase,
  Banknote,
  ShieldAlert,
  // Impuestos
  FileBarChart,
  FileSearch,
  Calculator,
  // CRM
  Users,
  UserPlus,
  Handshake,
  Filter,
  MessageSquare,
  FileSignature,
  Tag,
  Megaphone,
  // Ventas
  ShoppingBag,
  ClipboardList,
  Trophy,
  // Compras
  Truck,
  PackageCheck,
  Star,
  // Inventario
  Package,
  Boxes,
  Warehouse,
  MoveHorizontal,
  SlidersHorizontal,
  // RRHH
  UserCircle,
  Network,
  UserSearch,
  UserCheck,
  DollarSign,
  Gift,
  UmbrellaOff,
  Clock,
  ClipboardCheck,
  FolderOpen,
  // Proyectos
  FolderKanban,
  CheckSquare,
  Kanban,
  Rocket,
  Map,
  Timer,
  // Documentos
  Folder,
  Scan,
  PenLine,
  History,
  FileType,
  // Analytics
  BarChart2,
  Gauge,
  ArrowUpDown,
  Layers,
  Download,
  // Auditoría
  UserCog,
  AlertTriangle,
  ClipboardCopy,
  // Integraciones
  HardDrive,
  Mail,
  Webhook,
  Key,
  // Administración
  Building,
  MapPin,
  UsersRound,
  Shield,
  Share2,
  Settings,
  // Seguridad
  ShieldCheck,
  Fingerprint,
  Smartphone,
  Lock,
  Globe,
  Eye,
  KeyRound,
  // Plataforma
  Store,
  Puzzle,
  Code2,
  // Soporte
  HelpCircle,
  TicketCheck,
  Signal,
  MessageCircle,
  MonitorSmartphone,
  Plug,
  ChevronRight,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  soon?: boolean;
  isNew?: boolean;
  requiredRoles?: string[];
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  id: string;
  href: string;
  label: string;
  soon?: boolean;
  isNew?: boolean;
  requiredRoles?: string[];
}

export interface NavSection {
  id: string;
  label: string;
  defaultOpen?: boolean;
  requiredRoles?: string[];
  items: NavItem[];
}

// ─── Navigation Tree ──────────────────────────────────────────────────────────

export const NAV_SECTIONS: NavSection[] = [
  // ── Principal ───────────────────────────────────────────────────────────────
  {
    id: 'principal',
    label: 'Principal',
    defaultOpen: true,
    items: [
      {
        id: 'dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
      },
      {
        id: 'activity',
        href: '/dashboard/activity',
        icon: Activity,
        label: 'Centro de Actividad',
        soon: true,
      },
      {
        id: 'tasks',
        href: '/dashboard/tasks',
        icon: Inbox,
        label: 'Bandeja de Tareas',
        soon: true,
      },
      {
        id: 'notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        label: 'Notificaciones',
        soon: true,
      },
      {
        id: 'calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
        label: 'Calendario',
        soon: true,
      },
    ],
  },

  // ── IA Empresarial ───────────────────────────────────────────────────────────
  {
    id: 'ia',
    label: 'IA Empresarial',
    defaultOpen: true,
    items: [
      {
        id: 'ai-chat',
        href: '/dashboard/ai/chat',
        icon: BrainCircuit,
        label: 'Chat IA',
        isNew: true,
        soon: true,
      },
      {
        id: 'ai-agents',
        href: '/dashboard/ai/agents',
        icon: Bot,
        label: 'Agentes IA',
        soon: true,
      },
      {
        id: 'ai-automations',
        href: '/dashboard/ai/automations',
        icon: Zap,
        label: 'Automatizaciones IA',
        soon: true,
      },
      {
        id: 'ai-workflows',
        href: '/dashboard/ai/workflows',
        icon: GitBranch,
        label: 'Flujos de Trabajo',
        soon: true,
      },
      {
        id: 'ai-templates',
        href: '/dashboard/ai/templates',
        icon: FileCode,
        label: 'Plantillas IA',
        soon: true,
      },
      {
        id: 'ai-prompts',
        href: '/dashboard/ai/prompts',
        icon: Library,
        label: 'Biblioteca de Prompts',
        soon: true,
      },
      {
        id: 'ai-knowledge',
        href: '/dashboard/ai/knowledge',
        icon: Database,
        label: 'Base de Conocimiento',
        soon: true,
      },
      {
        id: 'ai-memory',
        href: '/dashboard/ai/memory',
        icon: BookMarked,
        label: 'Memoria Organizacional',
        soon: true,
      },
    ],
  },

  // ── Contabilidad ─────────────────────────────────────────────────────────────
  {
    id: 'accounting',
    label: 'Contabilidad',
    defaultOpen: false,
    items: [
      {
        id: 'accounting-summary',
        href: '/dashboard/accounting',
        icon: BookOpen,
        label: 'Resumen Contable',
        soon: true,
      },
      {
        id: 'chart-of-accounts',
        href: '/dashboard/accounting/chart-of-accounts',
        icon: ListTree,
        label: 'Plan de Cuentas',
        soon: true,
      },
      {
        id: 'journal-entries',
        href: '/dashboard/accounting/journal-entries',
        icon: BookText,
        label: 'Asientos Contables',
        soon: true,
      },
      {
        id: 'general-journal',
        href: '/dashboard/accounting/general-journal',
        icon: ScrollText,
        label: 'Libro Diario',
        soon: true,
      },
      {
        id: 'general-ledger',
        href: '/dashboard/accounting/general-ledger',
        icon: BookOpen,
        label: 'Libro Mayor',
        soon: true,
      },
      {
        id: 'trial-balance',
        href: '/dashboard/accounting/trial-balance',
        icon: Scale,
        label: 'Balance de Comprobación',
        soon: true,
      },
      {
        id: 'financial-statements',
        href: '/dashboard/accounting/financial-statements',
        icon: BarChart3,
        label: 'Estados Financieros',
        soon: true,
        subItems: [
          {
            id: 'balance-sheet',
            href: '/dashboard/accounting/financial-statements/balance-sheet',
            label: 'Balance General',
            soon: true,
          },
          {
            id: 'income-statement',
            href: '/dashboard/accounting/financial-statements/income-statement',
            label: 'Estado de Resultados',
            soon: true,
          },
          {
            id: 'cash-flow',
            href: '/dashboard/accounting/financial-statements/cash-flow',
            label: 'Flujo de Efectivo',
            soon: true,
          },
          {
            id: 'equity-statement',
            href: '/dashboard/accounting/financial-statements/equity-statement',
            label: 'Estado de Patrimonio',
            soon: true,
          },
        ],
      },
      {
        id: 'cost-centers',
        href: '/dashboard/accounting/cost-centers',
        icon: Building2,
        label: 'Centros de Costos',
        soon: true,
      },
      {
        id: 'fixed-assets',
        href: '/dashboard/accounting/fixed-assets',
        icon: Landmark,
        label: 'Activos Fijos',
        soon: true,
      },
      {
        id: 'depreciation',
        href: '/dashboard/accounting/depreciation',
        icon: TrendingDown,
        label: 'Depreciaciones',
        soon: true,
      },
      {
        id: 'closing',
        href: '/dashboard/accounting/closing',
        icon: RefreshCcw,
        label: 'Cierres Contables',
        soon: true,
        requiredRoles: ['admin', 'accountant'],
      },
      {
        id: 'bank-reconciliation',
        href: '/dashboard/accounting/bank-reconciliation',
        icon: ArrowLeftRight,
        label: 'Conciliaciones Bancarias',
        soon: true,
      },
    ],
  },

  // ── Facturación ──────────────────────────────────────────────────────────────
  {
    id: 'invoicing',
    label: 'Facturación',
    defaultOpen: false,
    items: [
      {
        id: 'invoices-out',
        href: '/dashboard/invoicing/issued',
        icon: FileText,
        label: 'Facturas Emitidas',
        soon: true,
      },
      {
        id: 'invoices-in',
        href: '/dashboard/invoicing/received',
        icon: FileInput,
        label: 'Facturas Recibidas',
        soon: true,
      },
      {
        id: 'credit-notes',
        href: '/dashboard/invoicing/credit-notes',
        icon: FileMinus,
        label: 'Notas de Crédito',
        soon: true,
      },
      {
        id: 'debit-notes',
        href: '/dashboard/invoicing/debit-notes',
        icon: FilePlus,
        label: 'Notas de Débito',
        soon: true,
      },
      {
        id: 'retentions',
        href: '/dashboard/invoicing/retentions',
        icon: Percent,
        label: 'Retenciones',
        soon: true,
      },
      {
        id: 'proformas',
        href: '/dashboard/invoicing/proformas',
        icon: FileCheck,
        label: 'Proformas',
        soon: true,
      },
      {
        id: 'receipts',
        href: '/dashboard/invoicing/receipts',
        icon: Printer,
        label: 'Recibos',
        soon: true,
      },
      {
        id: 'collections',
        href: '/dashboard/invoicing/collections',
        icon: CircleDollarSign,
        label: 'Cobros',
        soon: true,
      },
      {
        id: 'payments',
        href: '/dashboard/invoicing/payments',
        icon: CreditCard,
        label: 'Pagos',
        soon: true,
      },
      {
        id: 'subscriptions',
        href: '/dashboard/invoicing/subscriptions',
        icon: Repeat,
        label: 'Suscripciones',
        soon: true,
      },
    ],
  },

  // ── Finanzas ─────────────────────────────────────────────────────────────────
  {
    id: 'finance',
    label: 'Finanzas',
    defaultOpen: false,
    items: [
      {
        id: 'treasury',
        href: '/dashboard/treasury',
        icon: Vault,
        label: 'Tesorería',
        soon: true,
      },
      {
        id: 'cash-flow-fin',
        href: '/dashboard/finance/cash-flow',
        icon: TrendingUp,
        label: 'Flujo de Caja',
        soon: true,
      },
      {
        id: 'accounts-receivable',
        href: '/dashboard/finance/accounts-receivable',
        icon: PiggyBank,
        label: 'Cuentas por Cobrar',
        soon: true,
      },
      {
        id: 'accounts-payable',
        href: '/dashboard/finance/accounts-payable',
        icon: Banknote,
        label: 'Cuentas por Pagar',
        soon: true,
      },
      {
        id: 'budgets',
        href: '/dashboard/finance/budgets',
        icon: Target,
        label: 'Presupuestos',
        soon: true,
      },
      {
        id: 'projections',
        href: '/dashboard/finance/projections',
        icon: LineChart,
        label: 'Proyecciones Financieras',
        soon: true,
      },
      {
        id: 'debt-management',
        href: '/dashboard/finance/debt',
        icon: BadgeAlert,
        label: 'Gestión de Deudas',
        soon: true,
      },
      {
        id: 'investments',
        href: '/dashboard/finance/investments',
        icon: Briefcase,
        label: 'Gestión de Inversiones',
        soon: true,
      },
      {
        id: 'banking',
        href: '/dashboard/finance/banking',
        icon: Landmark,
        label: 'Gestión Bancaria',
        soon: true,
      },
      {
        id: 'risk',
        href: '/dashboard/finance/risk',
        icon: ShieldAlert,
        label: 'Gestión de Riesgos',
        soon: true,
      },
    ],
  },

  // ── Impuestos ────────────────────────────────────────────────────────────────
  {
    id: 'taxes',
    label: 'Impuestos',
    defaultOpen: false,
    items: [
      {
        id: 'tax-dashboard',
        href: '/dashboard/taxes',
        icon: FileBarChart,
        label: 'Dashboard Tributario',
        soon: true,
      },
      {
        id: 'declarations',
        href: '/dashboard/taxes/declarations',
        icon: FileSearch,
        label: 'Declaraciones',
        soon: true,
      },
      {
        id: 'vat',
        href: '/dashboard/taxes/vat',
        icon: Percent,
        label: 'IVA',
        soon: true,
      },
      {
        id: 'tax-retentions',
        href: '/dashboard/taxes/retentions',
        icon: Receipt,
        label: 'Retenciones',
        soon: true,
      },
      {
        id: 'annexes',
        href: '/dashboard/taxes/annexes',
        icon: Layers,
        label: 'Anexos',
        soon: true,
      },
      {
        id: 'tax-calendar',
        href: '/dashboard/taxes/calendar',
        icon: Calendar,
        label: 'Calendario Fiscal',
        soon: true,
      },
      {
        id: 'tax-audit',
        href: '/dashboard/taxes/audit',
        icon: Eye,
        label: 'Auditoría Tributaria',
        soon: true,
        requiredRoles: ['admin', 'accountant'],
      },
      {
        id: 'tax-simulator',
        href: '/dashboard/taxes/simulator',
        icon: Calculator,
        label: 'Simulador Tributario',
        soon: true,
      },
    ],
  },

  // ── CRM ─────────────────────────────────────────────────────────────────────
  {
    id: 'crm',
    label: 'CRM',
    defaultOpen: false,
    items: [
      {
        id: 'clients',
        href: '/dashboard/crm/clients',
        icon: Users,
        label: 'Clientes',
        soon: true,
      },
      {
        id: 'prospects',
        href: '/dashboard/crm/prospects',
        icon: UserPlus,
        label: 'Prospectos',
        soon: true,
      },
      {
        id: 'opportunities',
        href: '/dashboard/crm/opportunities',
        icon: Target,
        label: 'Oportunidades',
        soon: true,
      },
      {
        id: 'sales-funnel',
        href: '/dashboard/crm/funnel',
        icon: Filter,
        label: 'Embudo de Ventas',
        soon: true,
      },
      {
        id: 'commercial-activities',
        href: '/dashboard/crm/activities',
        icon: Activity,
        label: 'Actividades Comerciales',
        soon: true,
      },
      {
        id: 'contracts',
        href: '/dashboard/crm/contracts',
        icon: FileSignature,
        label: 'Contratos',
        soon: true,
      },
      {
        id: 'quotes-crm',
        href: '/dashboard/crm/quotes',
        icon: FileText,
        label: 'Cotizaciones',
        soon: true,
      },
      {
        id: 'segmentation',
        href: '/dashboard/crm/segmentation',
        icon: Tag,
        label: 'Segmentación',
        soon: true,
      },
      {
        id: 'campaigns',
        href: '/dashboard/crm/campaigns',
        icon: Megaphone,
        label: 'Campañas',
        soon: true,
      },
    ],
  },

  // ── Ventas ───────────────────────────────────────────────────────────────────
  {
    id: 'sales',
    label: 'Ventas',
    defaultOpen: false,
    items: [
      {
        id: 'sales-dashboard',
        href: '/dashboard/sales',
        icon: ShoppingBag,
        label: 'Dashboard Comercial',
        soon: true,
      },
      {
        id: 'orders',
        href: '/dashboard/sales/orders',
        icon: ClipboardList,
        label: 'Pedidos',
        soon: true,
      },
      {
        id: 'quotes-sales',
        href: '/dashboard/sales/quotes',
        icon: FileText,
        label: 'Cotizaciones',
        soon: true,
      },
      {
        id: 'contracts-sales',
        href: '/dashboard/sales/contracts',
        icon: FileSignature,
        label: 'Contratos',
        soon: true,
      },
      {
        id: 'pipeline',
        href: '/dashboard/sales/pipeline',
        icon: Layers,
        label: 'Pipeline',
        soon: true,
      },
      {
        id: 'sales-targets',
        href: '/dashboard/sales/targets',
        icon: Trophy,
        label: 'Objetivos de Ventas',
        soon: true,
      },
      {
        id: 'commissions',
        href: '/dashboard/sales/commissions',
        icon: DollarSign,
        label: 'Comisiones',
        soon: true,
      },
      {
        id: 'forecast',
        href: '/dashboard/sales/forecast',
        icon: LineChart,
        label: 'Forecast Comercial',
        soon: true,
      },
    ],
  },

  // ── Compras ──────────────────────────────────────────────────────────────────
  {
    id: 'purchasing',
    label: 'Compras',
    defaultOpen: false,
    items: [
      {
        id: 'suppliers',
        href: '/dashboard/purchasing/suppliers',
        icon: Truck,
        label: 'Proveedores',
        soon: true,
      },
      {
        id: 'purchase-requests',
        href: '/dashboard/purchasing/requests',
        icon: ClipboardList,
        label: 'Solicitudes de Compra',
        soon: true,
      },
      {
        id: 'purchase-orders',
        href: '/dashboard/purchasing/orders',
        icon: ShoppingBag,
        label: 'Órdenes de Compra',
        soon: true,
      },
      {
        id: 'reception',
        href: '/dashboard/purchasing/reception',
        icon: PackageCheck,
        label: 'Recepción de Productos',
        soon: true,
      },
      {
        id: 'supplier-invoices',
        href: '/dashboard/purchasing/invoices',
        icon: FileInput,
        label: 'Facturas de Proveedores',
        soon: true,
      },
      {
        id: 'supplier-payments',
        href: '/dashboard/purchasing/payments',
        icon: CreditCard,
        label: 'Pagos a Proveedores',
        soon: true,
      },
      {
        id: 'supplier-evaluation',
        href: '/dashboard/purchasing/evaluation',
        icon: Star,
        label: 'Evaluación de Proveedores',
        soon: true,
      },
    ],
  },

  // ── Inventario ───────────────────────────────────────────────────────────────
  {
    id: 'inventory',
    label: 'Inventario',
    defaultOpen: false,
    items: [
      {
        id: 'inventory-dashboard',
        href: '/dashboard/inventory',
        icon: Package,
        label: 'Dashboard de Inventario',
        soon: true,
      },
      {
        id: 'products',
        href: '/dashboard/inventory/products',
        icon: Boxes,
        label: 'Productos',
        soon: true,
      },
      {
        id: 'categories',
        href: '/dashboard/inventory/categories',
        icon: Tag,
        label: 'Categorías',
        soon: true,
      },
      {
        id: 'warehouses',
        href: '/dashboard/inventory/warehouses',
        icon: Warehouse,
        label: 'Almacenes',
        soon: true,
      },
      {
        id: 'stock',
        href: '/dashboard/inventory/stock',
        icon: Layers,
        label: 'Existencias',
        soon: true,
      },
      {
        id: 'movements',
        href: '/dashboard/inventory/movements',
        icon: MoveHorizontal,
        label: 'Movimientos',
        soon: true,
      },
      {
        id: 'transfers',
        href: '/dashboard/inventory/transfers',
        icon: ArrowLeftRight,
        label: 'Transferencias',
        soon: true,
      },
      {
        id: 'adjustments',
        href: '/dashboard/inventory/adjustments',
        icon: SlidersHorizontal,
        label: 'Ajustes',
        soon: true,
      },
      {
        id: 'kardex',
        href: '/dashboard/inventory/kardex',
        icon: ScrollText,
        label: 'Kardex',
        soon: true,
      },
      {
        id: 'valuation',
        href: '/dashboard/inventory/valuation',
        icon: BarChart3,
        label: 'Valorización',
        soon: true,
      },
    ],
  },

  // ── Recursos Humanos ─────────────────────────────────────────────────────────
  {
    id: 'hr',
    label: 'Recursos Humanos',
    defaultOpen: false,
    items: [
      {
        id: 'employees',
        href: '/dashboard/hr/employees',
        icon: Users,
        label: 'Empleados',
        soon: true,
      },
      {
        id: 'org-chart',
        href: '/dashboard/hr/org-chart',
        icon: Network,
        label: 'Organigrama',
        soon: true,
      },
      {
        id: 'recruitment',
        href: '/dashboard/hr/recruitment',
        icon: UserSearch,
        label: 'Reclutamiento',
        soon: true,
      },
      {
        id: 'onboarding',
        href: '/dashboard/hr/onboarding',
        icon: UserCheck,
        label: 'Onboarding',
        soon: true,
      },
      {
        id: 'payroll',
        href: '/dashboard/hr/payroll',
        icon: DollarSign,
        label: 'Nómina',
        soon: true,
      },
      {
        id: 'benefits',
        href: '/dashboard/hr/benefits',
        icon: Gift,
        label: 'Beneficios',
        soon: true,
      },
      {
        id: 'vacations',
        href: '/dashboard/hr/vacations',
        icon: UmbrellaOff,
        label: 'Vacaciones',
        soon: true,
      },
      {
        id: 'attendance',
        href: '/dashboard/hr/attendance',
        icon: Clock,
        label: 'Asistencia',
        soon: true,
      },
      {
        id: 'evaluations',
        href: '/dashboard/hr/evaluations',
        icon: ClipboardCheck,
        label: 'Evaluaciones',
        soon: true,
      },
      {
        id: 'hr-documents',
        href: '/dashboard/hr/documents',
        icon: FolderOpen,
        label: 'Documentos Laborales',
        soon: true,
      },
    ],
  },

  // ── Proyectos ────────────────────────────────────────────────────────────────
  {
    id: 'projects',
    label: 'Proyectos',
    defaultOpen: false,
    items: [
      {
        id: 'projects-dashboard',
        href: '/dashboard/projects',
        icon: FolderKanban,
        label: 'Dashboard de Proyectos',
        soon: true,
      },
      {
        id: 'projects-list',
        href: '/dashboard/projects/list',
        icon: Briefcase,
        label: 'Proyectos',
        soon: true,
      },
      {
        id: 'project-tasks',
        href: '/dashboard/projects/tasks',
        icon: CheckSquare,
        label: 'Tareas',
        soon: true,
      },
      {
        id: 'kanban',
        href: '/dashboard/projects/kanban',
        icon: Kanban,
        label: 'Kanban',
        soon: true,
      },
      {
        id: 'sprints',
        href: '/dashboard/projects/sprints',
        icon: Rocket,
        label: 'Sprints',
        soon: true,
      },
      {
        id: 'roadmaps',
        href: '/dashboard/projects/roadmaps',
        icon: Map,
        label: 'Roadmaps',
        soon: true,
      },
      {
        id: 'time-tracking',
        href: '/dashboard/projects/time-tracking',
        icon: Timer,
        label: 'Seguimiento de Tiempo',
        soon: true,
      },
      {
        id: 'project-costs',
        href: '/dashboard/projects/costs',
        icon: CircleDollarSign,
        label: 'Costos de Proyecto',
        soon: true,
      },
    ],
  },

  // ── Documentos ───────────────────────────────────────────────────────────────
  {
    id: 'documents',
    label: 'Documentos',
    defaultOpen: false,
    items: [
      {
        id: 'doc-manager',
        href: '/dashboard/documents',
        icon: Folder,
        label: 'Gestor Documental',
        soon: true,
      },
      {
        id: 'ocr',
        href: '/dashboard/documents/ocr',
        icon: Scan,
        label: 'OCR',
        soon: true,
        isNew: true,
      },
      {
        id: 'e-signature',
        href: '/dashboard/documents/signature',
        icon: PenLine,
        label: 'Firma Electrónica',
        soon: true,
      },
      {
        id: 'versioning',
        href: '/dashboard/documents/versioning',
        icon: History,
        label: 'Versionado',
        soon: true,
      },
      {
        id: 'doc-templates',
        href: '/dashboard/documents/templates',
        icon: FileType,
        label: 'Plantillas',
        soon: true,
      },
    ],
  },

  // ── Analytics & BI ───────────────────────────────────────────────────────────
  {
    id: 'analytics',
    label: 'Analytics & BI',
    defaultOpen: false,
    items: [
      {
        id: 'executive-dashboard',
        href: '/dashboard/analytics',
        icon: Gauge,
        label: 'Dashboard Ejecutivo',
        soon: true,
      },
      {
        id: 'reports',
        href: '/dashboard/analytics/reports',
        icon: BarChart2,
        label: 'Reportes',
        soon: true,
      },
      {
        id: 'kpis',
        href: '/dashboard/analytics/kpis',
        icon: Target,
        label: 'KPIs',
        soon: true,
      },
      {
        id: 'financial-indicators',
        href: '/dashboard/analytics/financial',
        icon: TrendingUp,
        label: 'Indicadores Financieros',
        soon: true,
      },
      {
        id: 'business-intelligence',
        href: '/dashboard/analytics/bi',
        icon: BrainCircuit,
        label: 'Inteligencia de Negocios',
        soon: true,
      },
      {
        id: 'data-warehouse',
        href: '/dashboard/analytics/data-warehouse',
        icon: Database,
        label: 'Data Warehouse',
        soon: true,
      },
      {
        id: 'exports',
        href: '/dashboard/analytics/exports',
        icon: Download,
        label: 'Exportaciones',
        soon: true,
      },
    ],
  },

  // ── Auditoría y Cumplimiento ─────────────────────────────────────────────────
  {
    id: 'audit',
    label: 'Auditoría y Cumplimiento',
    defaultOpen: false,
    requiredRoles: ['admin', 'auditor'],
    items: [
      {
        id: 'system-logs',
        href: '/dashboard/audit',
        icon: ScrollText,
        label: 'Logs del Sistema',
      },
      {
        id: 'user-audit',
        href: '/dashboard/audit/users',
        icon: UserCog,
        label: 'Auditoría de Usuarios',
      },
      {
        id: 'financial-audit',
        href: '/dashboard/audit/financial',
        icon: BarChart3,
        label: 'Auditoría Financiera',
        soon: true,
      },
      {
        id: 'compliance',
        href: '/dashboard/compliance',
        icon: ClipboardCheck,
        label: 'Cumplimiento Normativo',
      },
      {
        id: 'risks',
        href: '/dashboard/audit/risks',
        icon: AlertTriangle,
        label: 'Riesgos',
        soon: true,
      },
      {
        id: 'traceability',
        href: '/dashboard/audit/traceability',
        icon: ClipboardCopy,
        label: 'Trazabilidad',
        soon: true,
      },
    ],
  },

  // ── Integraciones ────────────────────────────────────────────────────────────
  {
    id: 'integrations',
    label: 'Integraciones',
    defaultOpen: false,
    items: [
      {
        id: 'integrations-all',
        href: '/dashboard/integrations',
        icon: Plug,
        label: 'Integraciones',
      },
      {
        id: 'gmail',
        href: '/dashboard/integrations/gmail',
        icon: Mail,
        label: 'Gmail / Outlook',
        soon: true,
      },
      {
        id: 'slack',
        href: '/dashboard/integrations/slack',
        icon: MessageSquare,
        label: 'Slack / WhatsApp',
        soon: true,
      },
      {
        id: 'api-keys',
        href: '/dashboard/integrations/api-keys',
        icon: Key,
        label: 'API Keys',
        soon: true,
      },
      {
        id: 'webhooks',
        href: '/dashboard/integrations/webhooks',
        icon: Webhook,
        label: 'Webhooks',
        soon: true,
      },
    ],
  },

  // ── Administración ───────────────────────────────────────────────────────────
  {
    id: 'admin',
    label: 'Administración',
    defaultOpen: false,
    requiredRoles: ['admin'],
    items: [
      {
        id: 'organization',
        href: '/dashboard/admin/organization',
        icon: Building,
        label: 'Organización',
        soon: true,
      },
      {
        id: 'companies',
        href: '/dashboard/admin/companies',
        icon: Building2,
        label: 'Empresas',
        soon: true,
      },
      {
        id: 'branches',
        href: '/dashboard/admin/branches',
        icon: MapPin,
        label: 'Sucursales',
        soon: true,
      },
      {
        id: 'users-admin',
        href: '/dashboard/admin/users',
        icon: Users,
        label: 'Usuarios',
        soon: true,
      },
      {
        id: 'teams',
        href: '/dashboard/admin/teams',
        icon: UsersRound,
        label: 'Equipos',
        soon: true,
      },
      {
        id: 'roles',
        href: '/dashboard/admin/roles',
        icon: Shield,
        label: 'Roles',
        soon: true,
      },
      {
        id: 'permissions',
        href: '/dashboard/admin/permissions',
        icon: Lock,
        label: 'Permisos',
        soon: true,
      },
      {
        id: 'delegations',
        href: '/dashboard/admin/delegations',
        icon: Share2,
        label: 'Delegaciones',
        soon: true,
      },
      {
        id: 'general-settings',
        href: '/dashboard/settings',
        icon: Settings,
        label: 'Configuración General',
      },
    ],
  },

  // ── Seguridad ────────────────────────────────────────────────────────────────
  {
    id: 'security',
    label: 'Seguridad',
    defaultOpen: false,
    items: [
      {
        id: 'security-center',
        href: '/dashboard/security',
        icon: ShieldCheck,
        label: 'Centro de Seguridad',
      },
      {
        id: 'passkeys',
        href: '/dashboard/security/passkeys',
        icon: Fingerprint,
        label: 'Passkeys',
      },
      {
        id: 'mfa',
        href: '/dashboard/profile/2fa',
        icon: KeyRound,
        label: 'MFA / 2FA',
      },
      {
        id: 'sessions',
        href: '/dashboard/security/sessions',
        icon: MonitorSmartphone,
        label: 'Sesiones Activas',
      },
      {
        id: 'devices',
        href: '/dashboard/security/devices',
        icon: Smartphone,
        label: 'Dispositivos',
      },
      {
        id: 'access-policies',
        href: '/dashboard/security/policies',
        icon: Lock,
        label: 'Políticas de Acceso',
        soon: true,
      },
      {
        id: 'sso',
        href: '/dashboard/security/sso',
        icon: Globe,
        label: 'SSO',
        soon: true,
        requiredRoles: ['admin'],
      },
      {
        id: 'security-audit',
        href: '/dashboard/audit',
        icon: Eye,
        label: 'Auditoría de Seguridad',
      },
    ],
  },

  // ── Plataforma ───────────────────────────────────────────────────────────────
  {
    id: 'platform',
    label: 'Plataforma',
    defaultOpen: false,
    requiredRoles: ['admin'],
    items: [
      {
        id: 'marketplace',
        href: '/dashboard/platform/marketplace',
        icon: Store,
        label: 'Marketplace',
        soon: true,
      },
      {
        id: 'extensions',
        href: '/dashboard/platform/extensions',
        icon: Puzzle,
        label: 'Extensiones',
        soon: true,
      },
      {
        id: 'developer-center',
        href: '/dashboard/platform/developer',
        icon: Code2,
        label: 'Developer Center',
        soon: true,
      },
    ],
  },

  // ── Soporte ──────────────────────────────────────────────────────────────────
  {
    id: 'support',
    label: 'Soporte',
    defaultOpen: false,
    items: [
      {
        id: 'help-center',
        href: '/dashboard/support',
        icon: HelpCircle,
        label: 'Centro de Ayuda',
      },
      {
        id: 'tickets',
        href: '/dashboard/support/tickets',
        icon: TicketCheck,
        label: 'Tickets',
        soon: true,
      },
      {
        id: 'system-status',
        href: '/dashboard/support/status',
        icon: Signal,
        label: 'Estado del Sistema',
      },
      {
        id: 'feedback',
        href: '/dashboard/support/feedback',
        icon: MessageCircle,
        label: 'Feedback',
      },
    ],
  },

  // ── Mi Cuenta ────────────────────────────────────────────────────────────────
  {
    id: 'account',
    label: 'Mi Cuenta',
    defaultOpen: false,
    items: [
      {
        id: 'profile',
        href: '/dashboard/profile',
        icon: UserCircle,
        label: 'Mi Perfil',
      },
      {
        id: 'account-settings',
        href: '/dashboard/settings',
        icon: Settings,
        label: 'Ajustes',
      },
    ],
  },
];

// ─── RBAC Helper ─────────────────────────────────────────────────────────────

/**
 * Filters nav sections based on user roles.
 * If a section/item has requiredRoles, the user must have at least one matching role.
 * 'admin' role bypasses all restrictions.
 */
export function filterNavByRoles(
  sections: NavSection[],
  userRoles: string[]
): NavSection[] {
  const isAdmin = userRoles.some((r) =>
    ['admin', 'ADMIN', 'SUPER_ADMIN', 'super_admin'].includes(r)
  );

  if (isAdmin) return sections;

  return sections
    .filter((section) => {
      if (!section.requiredRoles) return true;
      return section.requiredRoles.some((r) => userRoles.includes(r));
    })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.requiredRoles) return true;
        return item.requiredRoles.some((r) => userRoles.includes(r));
      }),
    }))
    .filter((section) => section.items.length > 0);
}
