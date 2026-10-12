import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="Team management">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Organization roles</h2>
        <div className="mt-5 space-y-4">
          {[
            { name: 'Ava Thompson', role: 'Owner', email: 'ava@leadflow.io' },
            { name: 'Maya Patel', role: 'Admin', email: 'maya@leadflow.io' },
            { name: 'Luis Gomez', role: 'Member', email: 'luis@leadflow.io' },
          ].map((person) => (
            <div key={person.email} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-500">{person.email}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{person.role}</span>
            </div>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
