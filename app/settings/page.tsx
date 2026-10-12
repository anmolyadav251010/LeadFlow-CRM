import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="Profile & settings">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Account settings</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Display name</label>
            <input defaultValue={String(session.user.name ?? 'LeadFlow User')} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Organization name</label>
            <input defaultValue="LeadFlow Studio" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" />
          </div>
          <button className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500">Save changes</button>
        </div>
      </div>
    </CRMLayout>
  );
}
