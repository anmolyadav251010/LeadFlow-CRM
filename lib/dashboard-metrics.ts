export type LeadMetricInput = {
  createdAt?: string | Date | null;
  status?: string | null;
  value?: number | string | { toNumber?: () => number } | null;
  archived?: boolean | null;
  nextFollowUp?: string | Date | null;
};

function parseMetricValue(value: LeadMetricInput['value']): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') return Number(value) || 0;
  if (value && typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    const parsed = value.toNumber();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function buildDashboardMetrics(leads: LeadMetricInput[] = [], tasks: LeadMetricInput[] = []) {
  const totalLeads = leads.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newLeadsThisMonth = leads.filter((lead) => {
    const created = lead.createdAt ? new Date(lead.createdAt) : null;
    if (!created || Number.isNaN(created.getTime())) return false;
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  }).length;

  const qualifiedLeads = leads.filter((lead) => lead.status === 'QUALIFIED').length;
  const wonDeals = leads.filter((lead) => lead.status === 'WON').length;
  const lostDeals = leads.filter((lead) => lead.status === 'LOST').length;

  const openOpportunities = leads
    .filter((lead) => !['WON', 'LOST'].includes(String(lead.status || '')) && !lead.archived)
    .reduce((sum, lead) => sum + parseMetricValue(lead.value), 0);
  const wonDealValue = leads
    .filter((lead) => lead.status === 'WON')
    .reduce((sum, lead) => sum + parseMetricValue(lead.value), 0);

  const now = new Date();
  const dueSoon = tasks.filter((task) => {
    const dueAt = task.nextFollowUp ? new Date(task.nextFollowUp) : null;
    return dueAt && !Number.isNaN(dueAt.getTime()) && dueAt <= now;
  }).length;

  const overdue = tasks.filter((task) => {
    const dueAt = task.nextFollowUp ? new Date(task.nextFollowUp) : null;
    return dueAt && !Number.isNaN(dueAt.getTime()) && dueAt < now;
  }).length;

  const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  return {
    totalLeads,
    newLeadsThisMonth,
    qualifiedLeads,
    wonDeals,
    lostDeals,
    openOpportunities,
    wonDealValue,
    dueSoon,
    overdue,
    conversionRate,
  };
}
