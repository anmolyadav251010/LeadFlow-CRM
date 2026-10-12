import { mockLeads, mockTasks, type LeadRecord, type TaskRecord } from '@/lib/mock-data';

export const leadStore: LeadRecord[] = [...mockLeads];
export const taskStore: TaskRecord[] = [...mockTasks];

export function readLeads() {
  return [...leadStore];
}

export function readTasks() {
  return [...taskStore];
}

export function createLead(input: {
  company: string;
  contact: string;
  email?: string;
  source?: string;
  status?: string;
  value?: number;
  owner?: string;
  notes?: string;
}) {
  const company = input.company?.trim();
  const contact = input.contact?.trim();

  if (!company || !contact) {
    throw new Error('Company and contact are required.');
  }

  const record: LeadRecord = {
    company,
    contact,
    status: (input.status as LeadRecord['status']) || 'New',
    source: input.source || 'Website',
    value: Number(input.value ?? 0),
    owner: input.owner || 'Ava',
    due: 'Next up',
  };

  leadStore.unshift(record);
  return record;
}

export function createTask(input: {
  title: string;
  owner?: string;
  due?: string;
  priority?: TaskRecord['priority'];
  status?: TaskRecord['status'];
}) {
  const title = input.title?.trim();
  if (!title) {
    throw new Error('Task title is required.');
  }

  const record: TaskRecord = {
    title,
    owner: input.owner || 'Ava',
    due: input.due || 'Soon',
    priority: input.priority || 'Medium',
    status: input.status || 'Open',
  };

  taskStore.unshift(record);
  return record;
}
