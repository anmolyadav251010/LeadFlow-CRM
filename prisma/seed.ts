import bcrypt from 'bcryptjs';
import { PrismaClient, LeadStatus, LeadSource, Priority, TaskStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Add it to your environment before running the seed script.');
  }

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const organization = await prisma.organization.upsert({
    where: { slug: 'leadflow-studio' },
    update: {},
    create: {
      name: 'LeadFlow Studio',
      slug: 'leadflow-studio',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'ava@leadflow.io' },
    update: {
      name: 'Ava Thompson',
      passwordHash,
      organizationId: organization.id,
    },
    create: {
      name: 'Ava Thompson',
      email: 'ava@leadflow.io',
      passwordHash,
      organizationId: organization.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: owner.id,
        organizationId: organization.id,
      },
    },
    update: { role: Role.OWNER },
    create: {
      userId: owner.id,
      organizationId: organization.id,
      role: Role.OWNER,
    },
  });

  const salesRep = await prisma.user.upsert({
    where: { email: 'maya@leadflow.io' },
    update: { organizationId: organization.id },
    create: {
      name: 'Maya Patel',
      email: 'maya@leadflow.io',
      passwordHash,
      organizationId: organization.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: salesRep.id,
        organizationId: organization.id,
      },
    },
    update: { role: Role.ADMIN },
    create: {
      userId: salesRep.id,
      organizationId: organization.id,
      role: Role.ADMIN,
    },
  });

  const companyNorthwind = await prisma.company.upsert({
    where: {
      id: 'demo-company-northwind',
    },
    update: {},
    create: {
      id: 'demo-company-northwind',
      name: 'Northwind Labs',
      website: 'northwindlabs.com',
      industry: 'SaaS',
      size: '51-200',
      organizationId: organization.id,
    },
  });

  const companyBluePeak = await prisma.company.upsert({
    where: {
      id: 'demo-company-bluepeak',
    },
    update: {},
    create: {
      id: 'demo-company-bluepeak',
      name: 'BluePeak Studio',
      website: 'bluepeak.studio',
      industry: 'Marketing',
      size: '11-50',
      organizationId: organization.id,
    },
  });

  const contacts = [
    {
      id: 'demo-contact-alicia',
      name: 'Alicia Reed',
      email: 'alicia@northwindlabs.com',
      phone: '+1 (415) 555-0104',
      jobTitle: 'Director of Growth',
      companyId: companyNorthwind.id,
    },
    {
      id: 'demo-contact-marcus',
      name: 'Marcus Chen',
      email: 'marcus@bluepeak.studio',
      phone: '+1 (212) 555-0192',
      jobTitle: 'Marketing Lead',
      companyId: companyBluePeak.id,
    },
  ];

  for (const contact of contacts) {
    await prisma.contact.upsert({
      where: { id: contact.id },
      update: {},
      create: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        jobTitle: contact.jobTitle,
        companyId: contact.companyId,
        organizationId: organization.id,
      },
    });
  }

  const leadEntries = [
    {
      id: 'demo-lead-1',
      fullName: 'Alicia Reed',
      email: 'alicia@northwindlabs.com',
      phone: '+1 (415) 555-0104',
      companyName: 'Northwind Labs',
      jobTitle: 'Director of Growth',
      leadSource: LeadSource.WEBSITE,
      status: LeadStatus.QUALIFIED,
      priority: Priority.HIGH,
      value: 24000,
      nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      notes: 'Strong fit for enterprise expansion and onboarding support.',
      ownerId: owner.id,
      assignedToId: salesRep.id,
      companyId: companyNorthwind.id,
    },
    {
      id: 'demo-lead-2',
      fullName: 'Marcus Chen',
      email: 'marcus@bluepeak.studio',
      phone: '+1 (212) 555-0192',
      companyName: 'BluePeak Studio',
      jobTitle: 'Marketing Lead',
      leadSource: LeadSource.REFERRAL,
      status: LeadStatus.PROPOSAL,
      priority: Priority.MEDIUM,
      value: 18000,
      nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      notes: 'Interested in a retainer package plus workflow optimization.',
      ownerId: owner.id,
      assignedToId: salesRep.id,
      companyId: companyBluePeak.id,
    },
    {
      id: 'demo-lead-3',
      fullName: 'Nina Patel',
      email: 'nina@summithealth.org',
      phone: '+1 (310) 555-0123',
      companyName: 'Summit Health',
      jobTitle: 'Partnerships Manager',
      leadSource: LeadSource.LINKEDIN,
      status: LeadStatus.NEW,
      priority: Priority.HIGH,
      value: 32000,
      nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      notes: 'Here for cross-sell conversation and process automation.',
      ownerId: owner.id,
      assignedToId: salesRep.id,
    },
  ];

  for (const lead of leadEntries) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {},
      create: {
        ...lead,
        organizationId: organization.id,
        value: lead.value,
      },
    });
  }

  const tasks = [
    {
      id: 'demo-task-1',
      title: 'Review Northwind onboarding sequence',
      description: 'Confirm the onboarding checklist and sales enablement plan.',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      leadId: 'demo-lead-1',
      assignedToId: salesRep.id,
    },
    {
      id: 'demo-task-2',
      title: 'Prepare BluePeak proposal draft',
      description: 'Assemble scope options and pricing recommendations.',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: TaskStatus.OPEN,
      priority: Priority.MEDIUM,
      leadId: 'demo-lead-2',
      assignedToId: owner.id,
    },
    {
      id: 'demo-task-3',
      title: 'Send welcome note to Summit Health',
      description: 'Provide first value-add resources and schedule a discovery meeting.',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      status: TaskStatus.OPEN,
      priority: Priority.HIGH,
      leadId: 'demo-lead-3',
      assignedToId: owner.id,
    },
  ];

  for (const task of tasks) {
    await prisma.followUpTask.upsert({
      where: { id: task.id },
      update: {},
      create: {
        ...task,
        organizationId: organization.id,
      },
    });
  }

  await prisma.leadActivity.upsert({
    where: { id: 'demo-activity-1' },
    update: {},
    create: {
      id: 'demo-activity-1',
      title: 'Initial discovery call booked',
      message: 'Alicia Reed confirmed the discovery session for next week.',
      organizationId: organization.id,
      leadId: 'demo-lead-1',
      userId: owner.id,
    },
  });

  await prisma.leadActivity.upsert({
    where: { id: 'demo-activity-2' },
    update: {},
    create: {
      id: 'demo-activity-2',
      title: 'Proposal review sent',
      message: 'Maya shared the strategy deck with BluePeak Studio.',
      organizationId: organization.id,
      leadId: 'demo-lead-2',
      userId: salesRep.id,
    },
  });

  console.log('Seeded LeadFlow demo data successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
