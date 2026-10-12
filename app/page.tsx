import Link from 'next/link';

const metrics = [
  { label: 'Active pipeline', value: '$184.2K', tone: 'emerald' },
  { label: 'Qualified leads', value: '128', tone: 'sky' },
  { label: 'Follow-ups due', value: '14', tone: 'amber' },
];

const pipeline = [
  { name: 'New', value: 32 },
  { name: 'Contacted', value: 24 },
  { name: 'Qualified', value: 19 },
  { name: 'Proposal', value: 12 },
  { name: 'Won', value: 7 },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">LeadFlow CRM</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sales command center</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <span>Pipeline</span>
            <span>Contacts</span>
            <span>Tasks</span>
            <Link href="/login" className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
              Sign in
            </Link>
          </nav>
        </header>

        <section className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.26em] text-blue-200">Built for revenue teams</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Turn pipeline into predictable growth.</h2>
              <p className="mt-4 text-base text-slate-300">
                Manage leads, task execution, and opportunity health from a single workspace built for modern sales teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-full bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400">
                Start free
              </Link>
              <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950/60 px-5 py-3 font-medium text-slate-100 transition hover:border-slate-500 hover:text-white">
                View dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-semibold text-slate-900">{metric.value}</span>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  metric.tone === 'emerald'
                    ? 'bg-emerald-100 text-emerald-700'
                    : metric.tone === 'sky'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-amber-100 text-amber-700'
                }`}>
                  +12.4%
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Pipeline overview</h2>
              <span className="text-sm text-slate-500">This month</span>
            </div>

            <div className="mt-8 flex h-56 items-end gap-4">
              {pipeline.map((step) => (
                <div key={step.name} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex w-full items-end justify-center rounded-t-2xl bg-gradient-to-t from-blue-500 to-cyan-400" style={{ height: `${step.value * 3.5}px` }} />
                  <span className="text-xs text-slate-500">{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Priority tasks</h2>
            <ul className="mt-5 space-y-4">
              {[
                'Follow up with Harbor Labs onboarding call',
                'Prepare proposal for Northwind expansion',
                'Review enterprise lead qualification list',
              ].map((task) => (
                <li key={task} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="text-sm text-slate-600">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
