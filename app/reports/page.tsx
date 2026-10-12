import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/crm-service';
import { buildDashboardMetrics } from '@/lib/dashboard-metrics';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  const data = await getDashboardData(session.organizationId);
  const metrics = buildDashboardMetrics(data.leads, data.tasks);

  const reportCards = [
    { label: 'Open pipeline value', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.openOpportunities), delta: '+12.4%' },
    { label: 'Qualified rate', value: `${metrics.conversionRate.toFixed(1)}%`, delta: '+2.1%' },
    { label: 'Due follow-ups', value: String(metrics.dueSoon), delta: 'Today' },
  ];

  return (
    <CRMLayout title="Reports">
      <section className="grid gap-4 md:grid-cols-3">
        {reportCards.map((report) => (
          <div key={report.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{report.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-semibold text-slate-900">{report.value}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{report.delta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Activity snapshot</h2>
        <div className="mt-5 space-y-4">
          {[
            `${metrics.newLeadsThisMonth} new leads added this month`,
            `${metrics.overdue} overdue follow-ups require action`,
            `${metrics.wonDeals} deals closed so far with ${metricValue(metrics.wonDealValue)} revenue`,
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
              <span className="text-sm text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </CRMLayout>
  );
}

function metricValue(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
