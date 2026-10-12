import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { getTasks } from '@/lib/crm-service';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  const tasks = await getTasks(session.organizationId);

  return (
    <CRMLayout title="Follow-up tasks">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Task board</h2>
          <Link href="/dashboard" className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Due {task.dueAt ? new Date(task.dueAt).toLocaleString() : 'No due date'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-slate-200 px-2.5 py-1 text-slate-700">{task.priority}</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">{task.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">No follow-up tasks are scheduled yet.</div>
          )}
        </div>
      </div>
    </CRMLayout>
  );
}
