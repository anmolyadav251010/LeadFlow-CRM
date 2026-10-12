'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/reports', label: 'Reports' },
  { href: '/contacts', label: 'Contacts' },
  { href: '/companies', label: 'Companies' },
  { href: '/teams', label: 'Teams' },
  { href: '/settings', label: 'Settings' },
];

export function CRMLayout({ title, children }: { title: string; children: ReactNode }) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Ava Thompson';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-lg font-bold text-cyan-300">L</div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">LeadFlow</p>
              <p className="text-sm font-semibold">CRM</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-100">{userName}</p>
                <p className="text-xs text-slate-400">Sales lead</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-label="online" />
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-4 shadow-lg shadow-slate-950/20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Sign out
            </button>
            <Link
              href="/leads/new"
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              + New lead
            </Link>
          </div>
        </header>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: 'cyan' | 'emerald' | 'amber' | 'violet' }) {
  const toneClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-300',
    emerald: 'bg-emerald-500/10 text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-300',
    violet: 'bg-violet-500/10 text-violet-300',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>{hint}</span>
      </div>
    </div>
  );
}
