import { describe, expect, it } from 'vitest';
import { buildDashboardMetrics } from './dashboard-metrics';

describe('buildDashboardMetrics', () => {
  it('calculates lead and task signals for the current org pipeline', () => {
    const result = buildDashboardMetrics(
      [
        { createdAt: new Date(), status: 'NEW', value: { toNumber: () => 1200 }, archived: false },
        { createdAt: new Date(), status: 'QUALIFIED', value: '2500', archived: false },
        { createdAt: new Date(Date.now() - 86400000), status: 'WON', value: { toNumber: () => 8000 }, archived: false },
        { createdAt: new Date(Date.now() - 86400000 * 10), status: 'LOST', value: 500, archived: false },
      ],
      [
        { nextFollowUp: new Date(Date.now() - 3600000), status: 'OPEN' },
        { nextFollowUp: new Date(Date.now() + 86400000), status: 'OPEN' },
      ],
    );

    expect(result.totalLeads).toBe(4);
    expect(result.qualifiedLeads).toBe(1);
    expect(result.wonDeals).toBe(1);
    expect(result.lostDeals).toBe(1);
    expect(result.openOpportunities).toBe(3700);
    expect(result.wonDealValue).toBe(8000);
    expect(result.dueSoon).toBe(1);
    expect(result.overdue).toBe(1);
  });

  it('returns empty-safe zero values when there are no leads or tasks', () => {
    const result = buildDashboardMetrics([], []);

    expect(result.totalLeads).toBe(0);
    expect(result.newLeadsThisMonth).toBe(0);
    expect(result.qualifiedLeads).toBe(0);
    expect(result.wonDeals).toBe(0);
    expect(result.lostDeals).toBe(0);
    expect(result.openOpportunities).toBe(0);
    expect(result.wonDealValue).toBe(0);
    expect(result.dueSoon).toBe(0);
    expect(result.overdue).toBe(0);
    expect(result.conversionRate).toBe(0);
  });
});
