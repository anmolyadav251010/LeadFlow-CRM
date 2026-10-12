import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">The record or route you requested is no longer available or does not exist in this workspace.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-500">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
