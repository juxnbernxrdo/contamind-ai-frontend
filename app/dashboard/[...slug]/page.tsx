'use client';

import { useParams } from 'next/navigation';
import { UnderConstruction } from '@/components/dashboard/UnderConstruction';

const SEGMENT_LABELS: Record<string, string> = {
  activity: 'Centro de Actividad',
  tasks: 'Bandeja de Tareas',
  notifications: 'Notificaciones',
  calendar: 'Calendario',
  ai: 'IA Empresarial',
  chat: 'Chat IA',
  agents: 'Agentes IA',
  automations: 'Automatizaciones IA',
  workflows: 'Flujos de Trabajo',
  templates: 'Plantillas IA',
  prompts: 'Biblioteca de Prompts',
  knowledge: 'Base de Conocimiento',
  memory: 'Memoria Organizacional',
  accounting: 'Contabilidad',
  'chart-of-accounts': 'Plan de Cuentas',
  'journal-entries': 'Asientos Contables',
  'general-journal': 'Libro Diario',
  'general-ledger': 'Libro Mayor',
  'trial-balance': 'Balance de Comprobación',
  'financial-statements': 'Estados Financieros',
  'balance-sheet': 'Balance General',
  'income-statement': 'Estado de Resultados',
  'cash-flow': 'Flujo de Efectivo',
  'equity-statement': 'Estado de Patrimonio',
  'cost-centers': 'Centros de Costos',
  'fixed-assets': 'Activos Fijos',
  depreciation: 'Depreciaciones',
  closing: 'Cierres Contables',
  'bank-reconciliation': 'Conciliaciones Bancarias',
  invoicing: 'Facturación',
  issued: 'Facturas Emitidas',
  received: 'Facturas Recibidas',
  'credit-notes': 'Notas de Crédito',
  'debit-notes': 'Notas de Débito',
  retentions: 'Retenciones',
  proformas: 'Proformas',
  receipts: 'Recibos',
  collections: 'Cobros',
  payments: 'Pagos',
  subscriptions: 'Suscripciones',
  treasury: 'Tesorería',
  finance: 'Finanzas',
  'accounts-receivable': 'Cuentas por Cobrar',
  'accounts-payable': 'Cuentas por Pagar',
  budgets: 'Presupuestos',
  projections: 'Proyecciones Financieras',
  debt: 'Gestión de Deudas',
  investments: 'Gestión de Inversiones',
  banking: 'Gestión Bancaria',
  risk: 'Gestión de Riesgos',
  taxes: 'Impuestos',
  declarations: 'Declaraciones',
  vat: 'IVA',
  annexes: 'Anexos',
  simulator: 'Simulador Tributario',
  crm: 'CRM',
  clients: 'Clientes',
  prospects: 'Prospectos',
  opportunities: 'Oportunidades',
  funnel: 'Embudo de Ventas',
  activities: 'Actividades Comerciales',
  contracts: 'Contratos',
  quotes: 'Cotizaciones',
  segmentation: 'Segmentación',
  campaigns: 'Campañas',
  sales: 'Ventas',
  orders: 'Pedidos',
  pipeline: 'Pipeline',
  targets: 'Objetivos de Ventas',
  commissions: 'Comisiones',
  forecast: 'Forecast Comercial',
  purchasing: 'Compras',
  suppliers: 'Proveedores',
  requests: 'Solicitudes de Compra',
  reception: 'Recepción de Productos',
  evaluation: 'Evaluación de Proveedores',
  inventory: 'Inventario',
  products: 'Productos',
  categories: 'Categorías',
  warehouses: 'Almacenes',
  stock: 'Existencias',
  movements: 'Movimientos',
  transfers: 'Transferencias',
  adjustments: 'Ajustes',
  kardex: 'Kardex',
  valuation: 'Valorización',
  hr: 'Recursos Humanos',
  employees: 'Empleados',
  'org-chart': 'Organigrama',
  recruitment: 'Reclutamiento',
  onboarding: 'Onboarding',
  payroll: 'Nómina',
  benefits: 'Beneficios',
  vacations: 'Vacaciones',
  attendance: 'Asistencia',
  evaluations: 'Evaluaciones',
  documents: 'Documentos',
  ocr: 'OCR',
  signature: 'Firma Electrónica',
  versioning: 'Versionado',
  analytics: 'Analytics & BI',
  reports: 'Reportes',
  kpis: 'KPIs',
  financial: 'Indicadores Financieros',
  bi: 'Inteligencia de Negocios',
  'data-warehouse': 'Data Warehouse',
  exports: 'Exportaciones',
  audit: 'Auditoría',
  users: 'Usuarios',
  compliance: 'Cumplimiento Normativo',
  traceability: 'Trazabilidad',
  integrations: 'Integraciones',
  gmail: 'Gmail / Outlook',
  slack: 'Slack / WhatsApp',
  'api-keys': 'API Keys',
  webhooks: 'Webhooks',
  admin: 'Administración',
  organization: 'Organización',
  companies: 'Empresas',
  branches: 'Sucursales',
  teams: 'Equipos',
  roles: 'Roles',
  permissions: 'Permisos',
  delegations: 'Delegaciones',
  security: 'Seguridad',
  passkeys: 'Passkeys',
  sso: 'SSO',
  policies: 'Políticas de Acceso',
  platform: 'Plataforma',
  marketplace: 'Marketplace',
  extensions: 'Extensiones',
  developer: 'Developer Center',
  support: 'Soporte',
  tickets: 'Tickets',
  status: 'Estado del Sistema',
  feedback: 'Feedback',
  projects: 'Proyectos',
  list: 'Proyectos',
  kanban: 'Kanban',
  sprints: 'Sprints',
  roadmaps: 'Roadmaps',
  'time-tracking': 'Seguimiento de Tiempo',
  costs: 'Costos de Proyecto',
  recovery: 'Códigos de Recuperación',
};

const NESTED_PATH_LABELS: Record<string, string> = {
  'audit/users': 'Gestión de Usuarios',
  'admin/organization': 'Organización',
  'admin/companies': 'Empresas',
  'admin/branches': 'Sucursales',
  'admin/teams': 'Equipos',
  'admin/roles': 'Roles & Permisos',
  'admin/permissions': 'Permisos',
  'admin/delegations': 'Delegaciones',
  'security/passkeys': 'Passkeys',
  'security/sso': 'Single Sign-On',
  'security/policies': 'Políticas de Acceso',
  'integrations/gmail': 'Gmail / Outlook',
  'integrations/slack': 'Slack / WhatsApp',
  'integrations/api-keys': 'API Keys',
  'integrations/webhooks': 'Webhooks',
  'platform/marketplace': 'Marketplace',
  'platform/extensions': 'Extensiones',
  'platform/developer': 'Developer Center',
  'support/tickets': 'Tickets de Soporte',
  'support/status': 'Estado del Sistema',
  'support/feedback': 'Feedback',
};

export default function CatchAllPage() {
  const params = useParams();
  const slug = params.slug as string[];

  const pathKey = slug.join('/');
  const nestedLabel = NESTED_PATH_LABELS[pathKey];

  const title = nestedLabel || SEGMENT_LABELS[slug[slug.length - 1]] || slug[slug.length - 1].replace(/-/g, ' ');

  const breadcrumbs = slug.map((segment, index) => ({
    label: SEGMENT_LABELS[segment] || segment.replace(/-/g, ' '),
    path: `/dashboard/${slug.slice(0, index + 1).join('/')}`,
  }));

  const hint = getBackendHint(pathKey);

  return (
    <UnderConstruction
      title={title}
      breadcrumbs={breadcrumbs}
      backendHint={hint ?? undefined}
    />
  );
}

function getBackendHint(pathKey: string): string | null {
  if (pathKey.startsWith('admin/')) return 'Módulo de administración — requiere backend NestJS con RBAC';
  if (pathKey.startsWith('security/')) return 'Módulo de seguridad — requiere integración con AuthModule';
  if (pathKey.startsWith('integrations/')) return 'Módulo de integraciones — requiere connectores externos';
  if (pathKey.startsWith('platform/')) return 'Módulo de plataforma — requiere backend de extensiones';
  if (pathKey.startsWith('support/')) return 'Módulo de soporte — requiere sistema de tickets';
  if (pathKey.startsWith('accounting/')) return 'Módulo contable — requiere motor contable SRI';
  if (pathKey.startsWith('invoicing/')) return 'Módulo de facturación — requiere integración SRI';
  if (pathKey.startsWith('taxes/')) return 'Módulo tributario — requiere motor de impuestos SRI';
  if (pathKey.startsWith('hr/')) return 'Módulo de RRHH — requiere backend de gestión de talento';
  if (pathKey.startsWith('crm/')) return 'Módulo CRM — requiere backend de gestión comercial';
  if (pathKey.startsWith('projects/')) return 'Módulo de proyectos — requiere backend de gestión de proyectos';
  return null;
}
