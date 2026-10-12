export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won';

export type LeadRecord = {
  company: string;
  contact: string;
  status: LeadStatus;
  value: number;
  source: string;
  owner: string;
  due: string;
};

export type TaskRecord = {
  title: string;
  owner: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In progress' | 'Completed';
};

export const mockLeads: LeadRecord[] = [
  { company: 'Northwind Labs', contact: 'Olivia Morgan', status: 'Qualified', value: 18400, source: 'Referral', owner: 'Maya', due: 'Today' },
  { company: 'Bluepeak Studio', contact: 'Ethan Brooks', status: 'Proposal', value: 12900, source: 'Website', owner: 'Dylan', due: 'Tomorrow' },
  { company: 'Summit Health', contact: 'Nina Patel', status: 'Contacted', value: 9700, source: 'LinkedIn', owner: 'Kira', due: 'Thu' },
  { company: 'Harbor Soft', contact: 'Lucas Hughes', status: 'New', value: 6300, source: 'Email', owner: 'Luis', due: 'Fri' },
  { company: 'Oak & Pine', contact: 'Alicia Reed', status: 'Qualified', value: 23250, source: 'Advertisement', owner: 'Maya', due: 'Mon' },
];

export const mockTasks: TaskRecord[] = [
  { title: 'Schedule onboarding consult', owner: 'Maya', due: 'Today', priority: 'High', status: 'Open' },
  { title: 'Send pricing deck to Northwind', owner: 'Dylan', due: 'Tomorrow', priority: 'High', status: 'In progress' },
  { title: 'Review CRM qualification notes', owner: 'Ava', due: 'Thu', priority: 'Medium', status: 'Open' },
  { title: 'Close follow-up with Summit Health', owner: 'Kira', due: 'Fri', priority: 'Low', status: 'Completed' },
];

export const mockPipeline = [
  { name: 'New', value: 32 },
  { name: 'Contacted', value: 24 },
  { name: 'Qualified', value: 19 },
  { name: 'Proposal', value: 12 },
  { name: 'Won', value: 7 },
];

export const mockReportStats = [
  { label: 'Revenue generated', value: '$72.8K', delta: '+9.3%' },
  { label: 'Win rate', value: '41.2%', delta: '+3.1%' },
  { label: 'Avg. response time', value: '4.2h', delta: '-1.1h' },
];

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
