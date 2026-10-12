'use server';

import { redirect } from 'next/navigation';
import { registrationSchema } from '@/lib/validation';
import { createOrganizationUser } from '@/lib/crm-service';

export async function registerAccount(formData: FormData) {
  const payload = registrationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? 'Invalid registration data.');
  }

  const result = await createOrganizationUser(payload.data);

  if (!result) {
    throw new Error('Unable to create the account. Please verify the database configuration.');
  }

  redirect('/login');
}
