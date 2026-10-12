import { z } from 'zod';

export const leadStatusEnum = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'] as const;
export const leadSourceEnum = ['WEBSITE', 'REFERRAL', 'LINKEDIN', 'EMAIL', 'ADVERTISEMENT', 'OTHER'] as const;
export const priorityEnum = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const taskStatusEnum = ['OPEN', 'IN_PROGRESS', 'COMPLETED'] as const;

const optionalString = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((value) => (typeof value === 'string' ? value.trim() : ''));

export const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.'),
  email: z.string().trim().email('Enter a valid email.').transform((value) => value.toLowerCase()),
  password: z.string().trim().min(8, 'Use at least 8 characters.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email.'),
  password: z.string().trim().min(8, 'Password is required.'),
});

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.'),
  email: optionalString,
  phone: optionalString,
  companyName: optionalString,
  jobTitle: optionalString,
  leadSource: z.enum(leadSourceEnum).default('WEBSITE'),
  status: z.enum(leadStatusEnum).default('NEW'),
  priority: z.enum(priorityEnum).default('MEDIUM'),
  value: z.coerce.number().min(0).optional().default(0),
  nextFollowUp: optionalString,
  notes: optionalString,
  assignedToId: optionalString,
});

export const taskSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.'),
  description: optionalString,
  dueAt: optionalString,
  priority: z.enum(priorityEnum).default('MEDIUM'),
  status: z.enum(taskStatusEnum).default('OPEN'),
  leadId: optionalString,
  assignedToId: optionalString,
});

export const leadStatusUpdateSchema = z.object({
  status: z.enum(leadStatusEnum),
});
