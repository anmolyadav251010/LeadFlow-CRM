import bcrypt from 'bcryptjs';

export type AuthMembership = {
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  memberships: AuthMembership[];
};

const defaultPasswordHash = bcrypt.hashSync('password123', 10);

const inMemoryUsers: AuthUser[] = [
  {
    id: 'demo-user',
    name: 'Ava Thompson',
    email: 'ava@leadflow.io',
    passwordHash: defaultPasswordHash,
    memberships: [{ organizationId: 'demo-org', role: 'OWNER' }],
  },
];

export function findAuthUserByEmail(email: string | null | undefined) {
  if (!email) return null;
  return inMemoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function createAuthUser(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const existing = findAuthUserByEmail(email);

  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email,
    passwordHash: bcrypt.hashSync(input.password, 10),
    memberships: [{ organizationId: 'demo-org', role: 'MEMBER' }],
  };

  inMemoryUsers.push(user);
  return user;
}

export function verifyAuthPassword(inputPassword: string, storedHash: string) {
  return bcrypt.compare(inputPassword, storedHash);
}
