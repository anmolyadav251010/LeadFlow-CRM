import { Role } from '@prisma/client';

export function hasPermission(role: Role | null | undefined, allowed: Role[]) {
  if (!role) return false;
  return allowed.includes(role);
}

export const orgRoles = ['OWNER', 'ADMIN', 'MEMBER'] as const;
export type OrgRole = (typeof orgRoles)[number];
