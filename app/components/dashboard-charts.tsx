'use client';

import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const pipelineData = [
  { name: 'New', value: 24 },
  { name: 'Contacted', value: 18 },
  { name: 'Qualified', value: 14 },
  { name: 'Proposal', value: 8 },
  { name: 'Won', value: 6 },
  { name: 'Lost', value: 2 },
];

const sourceData = [
  { name: 'Website', value: 32 },
  { name: 'Referral', value: 26 },
  { name: 'LinkedIn', value: 18 },
  { name: 'Email', value: 14 },
  { name: 'Ads', value: 10 },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export function PipelineChart() {
  return (
    <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-slate-900">Sales pipeline</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pipelineData}>
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourceBreakdownChart() {
  return (
    <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-slate-900">Lead sources</p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
            {sourceData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
