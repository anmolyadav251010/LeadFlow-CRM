import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { getLeads } from '@/lib/crm-service';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  const { id } = await params;
  const leads = await getLeads(session.organizationId);
  const lead = leads.find((entry) => entry.id === id);

  if (!lead) {
    notFound();
  }

  return (
    <CRMLayout title={lead.fullName}>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Lead overview</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{lead.fullName}</h2>
            </div>
            <Link href="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Back to list
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Company</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{lead.companyName ?? 'Unnamed company'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Value</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{lead.value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(lead.value)) : '$0'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Source</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{lead.leadSource}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{lead.status}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <p className="mt-3 text-slate-600">{lead.notes || 'No notes recorded yet for this lead.'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Summary</p>
            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{lead.priority}</span>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>Email: {lead.email || 'N/A'}</p>
              <p>Phone: {lead.phone || 'N/A'}</p>
              <p>Next follow-up: {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : 'No scheduled follow-up'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actions</p>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Schedule call</button>
              <button className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 hover:border-slate-400">Add note</button>
              <button className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 hover:border-slate-400">Share proposal</button>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
