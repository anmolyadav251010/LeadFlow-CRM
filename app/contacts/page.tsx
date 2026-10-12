import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="Contacts">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Contact directory</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { name: 'Alicia Reed', email: 'alicia@northwind.com', company: 'Northwind Labs', title: 'Director of Growth' },
            { name: 'Marcus Chen', email: 'marcus@bluepeak.io', company: 'BluePeak Studio', title: 'Marketing Lead' },
            { name: 'Nina Patel', email: 'nina@summithealth.org', company: 'Summit Health', title: 'Partnerships Manager' },
          ].map((person) => (
            <div key={person.email} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">{person.name}</p>
              <p className="mt-2 text-sm text-slate-600">{person.title}</p>
              <p className="mt-1 text-sm text-slate-500">{person.company}</p>
              <a href={`mailto:${person.email}`} className="mt-3 block text-sm font-medium text-blue-600">{person.email}</a>
            </div>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
