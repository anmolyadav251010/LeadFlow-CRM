import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="Companies">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Company portfolio</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { name: 'Northwind Labs', industry: 'SaaS', size: '51-200', website: 'northwindlabs.com' },
            { name: 'BluePeak Studio', industry: 'Agency', size: '11-50', website: 'bluepeak.studio' },
            { name: 'Summit Health', industry: 'Healthcare', size: '201-500', website: 'summithealth.org' },
          ].map((company) => (
            <div key={company.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">{company.name}</p>
              <p className="mt-2 text-sm text-slate-600">{company.industry}</p>
              <p className="mt-1 text-sm text-slate-500">{company.size} employees</p>
              <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-blue-600">{company.website}</a>
            </div>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
