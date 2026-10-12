import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((value) => (typeof value === 'string' ? value.trim() : ''));

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.'),
  email: z.union([z.string().trim().email('Enter a valid email.'), z.literal('')]).optional().transform((value) => (value === '' ? '' : value)),
  phone: z.union([z.string().trim().min(3, 'Phone is required.'), z.literal('')]).optional().transform((value) => (value === '' ? '' : value)),
  companyName: optionalText,
  jobTitle: optionalText,
  leadSource: z.enum(['WEBSITE', 'REFERRAL', 'LINKEDIN', 'EMAIL', 'ADVERTISEMENT', 'OTHER']).default('WEBSITE'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']).default('NEW'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  value: z.coerce.number().min(0).optional(),
  nextFollowUp: optionalText,
  assignedToId: optionalText,
  notes: optionalText,
  archived: z.boolean().optional().default(false),
});

export const taskSchema = z.object({
  title: z.string().trim().min(2, 'Task title is required.'),
  description: optionalText,
  leadId: optionalText,
  assignedToId: optionalText,
  dueAt: optionalText,
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']).default('OPEN'),
});

export const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.'),
  email: z.string().trim().email('A valid email is required.').transform((email) => email.toLowerCase()),
  password: z.string().trim().min(8, 'Use at least 8 characters.'),
});
