'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { createLeadRecord, createTaskRecord, updateLeadStatus, updateTaskStatus } from '@/lib/crm-service';
import { leadSchema, leadStatusUpdateSchema, taskSchema } from '@/lib/validation';

export async function createLeadAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.user || !session.organizationId) {
    throw new Error('You must be signed in to create a lead.');
  }

  const payload = leadSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    companyName: formData.get('companyName'),
    jobTitle: formData.get('jobTitle'),
    leadSource: formData.get('leadSource'),
    status: formData.get('status'),
    priority: formData.get('priority'),
    value: formData.get('value'),
    nextFollowUp: formData.get('nextFollowUp'),
    notes: formData.get('notes'),
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? 'Please review the lead details and try again.');
  }

  const lead = await createLeadRecord(session.organizationId, String(session.user.id ?? ''), payload.data);

  if (!lead) {
    throw new Error('Lead creation failed. Confirm your database connection and try again.');
  }

  revalidatePath('/leads');
  revalidatePath('/dashboard');
  redirect('/leads');
}

export async function createTaskAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.user || !session.organizationId) {
    throw new Error('You must be signed in to create a follow-up task.');
  }

  const payload = taskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    dueAt: formData.get('dueAt'),
    priority: formData.get('priority'),
    status: formData.get('status'),
    leadId: formData.get('leadId'),
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? 'Please review the task details.');
  }

  const task = await createTaskRecord(session.organizationId, String(session.user.id ?? ''), payload.data);

  if (!task) {
    throw new Error('Task creation failed. Confirm your database connection and try again.');
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  redirect('/tasks');
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  const result = leadStatusUpdateSchema.safeParse({ status });
  if (!result.success) {
    throw new Error('The lead status is invalid.');
  }

  const session = await getAuthSession();
  if (!session?.user || !session.organizationId) {
    throw new Error('You are not authorized to update lead status.');
  }

  const updated = await updateLeadStatus(session.organizationId, leadId, result.data.status as any);
  if (!updated) {
    throw new Error('Status update failed.');
  }

  revalidatePath('/dashboard');
  revalidatePath('/leads');
  return updated;
}

export async function toggleTaskStatusAction(taskId: string, status: string) {
  const session = await getAuthSession();
  if (!session?.user || !session.organizationId) {
    throw new Error('You are not authorized to update tasks.');
  }

  const updated = await updateTaskStatus(session.organizationId, taskId, status as any);
  if (!updated) {
    throw new Error('Task update failed.');
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  return updated;
}
