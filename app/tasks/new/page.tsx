import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CRMLayout } from '@/app/components/crm-shell';
import { getAuthSession } from '@/lib/auth';
import { createTaskAction } from '@/app/actions';

export default async function NewTaskPage() {
  const session = await getAuthSession();

  if (!session?.user || !session.organizationId) {
    redirect('/login');
  }

  return (
    <CRMLayout title="New task">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create a new task</h2>
          <Link href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to tasks
          </Link>
        </div>

        <form action={createTaskAction} className="space-y-5">
          <label className="block space-y-2 text-sm text-slate-700">
            <span>Task title</span>
            <input name="title" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="Create onboarding checklist" />
          </label>

          <label className="block space-y-2 text-sm text-slate-700">
            <span>Description</span>
            <textarea name="description" rows={3} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="Review team onboarding steps and confirm next steps for the customer." />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2 text-sm text-slate-700">
              <span>Due date</span>
              <input name="dueAt" type="datetime-local" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" />
            </label>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Priority</span>
              <select name="priority" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="MEDIUM">
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2 text-sm text-slate-700">
              <span>Status</span>
              <select name="status" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" defaultValue="OPEN">
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Lead ID (optional)</span>
              <input name="leadId" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-400" placeholder="Optional CRM lead ID" />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/tasks" className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400">
              Cancel
            </Link>
            <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
              Save task
            </button>
          </div>
        </form>
      </div>
    </CRMLayout>
  );
}
