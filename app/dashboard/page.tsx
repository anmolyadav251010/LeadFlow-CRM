import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/crm-service';
import { buildDashboardMetrics } from '@/lib/dashboard-metrics';
import { CRMLayout, StatCard } from '@/app/components/crm-shell';
import { PipelineChart, SourceBreakdownChart } from '@/app/components/dashboard-charts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  const data = await getDashboardData(session.organizationId);
  const metrics = buildDashboardMetrics(data.leads, data.tasks);

  return (
    <CRMLayout title="Dashboard">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={String(metrics.totalLeads)} hint="Live" tone="cyan" />
        <StatCard label="New this month" value={String(metrics.newLeadsThisMonth)} hint="+8%" tone="emerald" />
        <StatCard label="Qualified" value={String(metrics.qualifiedLeads)} hint="Pipeline" tone="amber" />
        <StatCard label="Won deals" value={String(metrics.wonDeals)} hint="Revenue" tone="violet" />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lost deals" value={String(metrics.lostDeals)} hint="Risk" tone="amber" />
        <StatCard label="Open value" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.openOpportunities)} hint="Open" tone="cyan" />
        <StatCard label="Won value" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.wonDealValue)} hint="Closed" tone="emerald" />
        <StatCard label="Conv. rate" value={`${metrics.conversionRate.toFixed(1)}%`} hint="Qualified" tone="violet" />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <PipelineChart />
        <div className="space-y-6">
          <SourceBreakdownChart />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-900">Upcoming follow-ups</p>
            <ul className="space-y-3 text-sm text-slate-600">
              {data.tasks.length > 0 ? (
                data.tasks.slice(0, 4).map((task) => (
                  <li key={task.id} className="flex justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>{task.title}</span>
                    <span className="text-slate-500">{task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No due date'}</span>
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-slate-500">No follow-up tasks yet.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent lead activity</h2>
            <Link href="/leads" className="text-sm font-medium text-blue-600">View all</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.recentLeads.length > 0 ? (
                  data.recentLeads.map((lead) => (
                    <tr key={lead.id} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">{lead.fullName}</td>
                      <td className="px-4 py-3"><span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{lead.status}</span></td>
                      <td className="px-4 py-3">{lead.value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(lead.value)) : '$0'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">No recent leads available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link href="/leads/new" className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-500">Add a lead</Link>
            <Link href="/tasks" className="block rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:border-slate-400">Create a task</Link>
            <Link href="/reports" className="block rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:border-slate-400">View reports</Link>
          </div>
        </div>
      </section>
    </CRMLayout>
  );
}
