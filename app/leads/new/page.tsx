import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { createLeadAction } from '@/app/actions';

export default async function NewLeadPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="New lead">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create a new lead</h2>
          <Link href="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to leads
          </Link>
        </div>

        <form action={createLeadAction} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Full name</span>
            <input name="fullName" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="Jordan Lee" />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input name="email" type="email" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="jordan@acme.studio" />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Phone</span>
            <input name="phone" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="+1-415-555-0142" />
          </label>

          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Company name</span>
            <input name="companyName" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="Acme Studio" />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Job title</span>
            <input name="jobTitle" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="VP of Growth" />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Lead source</span>
            <select name="leadSource" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="WEBSITE">
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="EMAIL">Email</option>
              <option value="ADVERTISEMENT">Advertisement</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Status</span>
            <select name="status" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="NEW">
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Priority</span>
            <select name="priority" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="MEDIUM">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Next follow-up</span>
            <input name="nextFollowUp" type="date" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" />
          </label>

          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Notes</span>
            <textarea name="notes" rows={4} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="Interested in a growth-focused CRM redesign and multi-step onboarding workflow." />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Link href="/leads" className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400">
              Cancel
            </Link>
            <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
              Save lead
            </button>
          </div>
        </form>
      </div>
    </CRMLayout>
  );
}
