import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { getLeads } from '@/lib/crm-service';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  const leads = await getLeads(session.organizationId);

  return (
    <CRMLayout title="Leads">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Lead pipeline</h2>
          <div className="flex items-center gap-3">
            <Link href="/leads/new" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              + New lead
            </Link>
            <Link href="/dashboard" className="text-sm text-blue-600 transition hover:text-blue-500">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="bg-white">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/leads/${lead.id}`} className="hover:text-blue-600">
                        {lead.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{lead.companyName ?? 'Unassigned company'}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{lead.status}</span></td>
                    <td className="px-4 py-3 text-slate-500">{lead.leadSource}</td>
                    <td className="px-4 py-3 text-slate-900">{lead.value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(lead.value)) : '$0'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No leads found for this organization yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CRMLayout>
  );
}
