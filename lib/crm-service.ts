import { Prisma, type LeadStatus, type Priority, type LeadSource, type TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function findOrganizationForUser(userId: string) {
  try {
    return await prisma.membership.findFirst({
      where: { userId },
      include: { organization: true },
    });
  } catch {
    return null;
  }
}

export async function createOrganizationUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name || !email || input.password.length < 8) {
    throw new Error('Name, email, and a valid password are required.');
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const org = await prisma.organization.create({
      data: {
        name: `${name.split(' ')[0]}'s workspace`,
        slug: `${email.split('@')[0]}-${Date.now()}`.replace(/[^a-z0-9-]/gi, '').toLowerCase(),
      },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(input.password, 12),
        organizationId: org.id,
      },
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'OWNER',
      },
    });

    return { user, organization: org };
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    return null;
  }
}

export async function getDashboardData(orgId: string) {
  try {
    const [leads, tasks, recentLeads, teamMembers] = await Promise.all([
      prisma.lead.findMany({
        where: { organizationId: orgId, archived: false },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.followUpTask.findMany({
        where: { organizationId: orgId },
        orderBy: { dueAt: 'asc' },
      }),
      prisma.lead.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.membership.findMany({
        where: { organizationId: orgId },
        include: { user: true },
      }),
    ]);

    return {
      leads,
      tasks,
      recentLeads,
      teamMembers,
    };
  } catch {
    return { leads: [], tasks: [], recentLeads: [], teamMembers: [] };
  }
}

export async function getLeads(orgId: string, options?: { search?: string; status?: string; priority?: string; source?: string }) {
  try {
    const search = options?.search?.trim();
    const where: Prisma.LeadWhereInput = { organizationId: orgId, archived: false };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (options?.status && options.status !== 'ALL') {
      where.status = options.status as LeadStatus;
    }

    if (options?.priority && options.priority !== 'ALL') {
      where.priority = options.priority as Priority;
    }

    if (options?.source && options.source !== 'ALL') {
      where.leadSource = options.source as LeadSource;
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: true, owner: true },
    });

    return leads;
  } catch {
    return [];
  }
}

export async function createLeadRecord(orgId: string, userId: string, payload: {
  fullName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  leadSource?: LeadSource;
  status?: LeadStatus;
  priority?: Priority;
  value?: number;
  nextFollowUp?: string;
  notes?: string;
}) {
  try {
    const lead = await prisma.lead.create({
      data: {
        organizationId: orgId,
        fullName: payload.fullName,
        email: payload.email || null,
        phone: payload.phone || null,
        companyName: payload.companyName || null,
        jobTitle: payload.jobTitle || null,
        leadSource: payload.leadSource || 'WEBSITE',
        status: payload.status || 'NEW',
        priority: payload.priority || 'MEDIUM',
        value: payload.value ? new Prisma.Decimal(payload.value.toString()) : new Prisma.Decimal('0'),
        nextFollowUp: payload.nextFollowUp ? new Date(payload.nextFollowUp) : null,
        notes: payload.notes || null,
        ownerId: userId,
      },
      include: { assignedTo: true, owner: true },
    });

    await prisma.leadActivity.create({
      data: {
        title: 'Lead created',
        message: `${payload.fullName} was created in the pipeline.`,
        organizationId: orgId,
        leadId: lead.id,
        userId,
      },
    });

    return lead;
  } catch {
    return null;
  }
}

export async function updateLeadStatus(orgId: string, leadId: string, status: LeadStatus) {
  try {
    return await prisma.lead.update({
      where: { id: leadId, organizationId: orgId },
      data: { status },
    });
  } catch {
    return null;
  }
}

export async function getTasks(orgId: string) {
  try {
    return await prisma.followUpTask.findMany({
      where: { organizationId: orgId },
      include: { lead: true, assignedTo: true },
      orderBy: { dueAt: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function createTaskRecord(orgId: string, userId: string, payload: {
  title: string;
  description?: string;
  dueAt?: string;
  priority?: Priority;
  status?: TaskStatus;
  leadId?: string;
}) {
  try {
    return await prisma.followUpTask.create({
      data: {
        organizationId: orgId,
        title: payload.title,
        description: payload.description || null,
        dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
        priority: payload.priority || 'MEDIUM',
        status: payload.status || 'OPEN',
        leadId: payload.leadId || null,
        assignedToId: userId,
      },
      include: { lead: true, assignedTo: true },
    });
  } catch {
    return null;
  }
}

export async function updateTaskStatus(orgId: string, taskId: string, status: TaskStatus) {
  try {
    return await prisma.followUpTask.update({
      where: { id: taskId, organizationId: orgId },
      data: { status },
    });
  } catch {
    return null;
  }
}

export async function getOrganizationsForUser(userId: string) {
  try {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: { organization: true },
    });
    return memberships.map((membership) => membership.organization);
  } catch {
    return [];
  }
}
