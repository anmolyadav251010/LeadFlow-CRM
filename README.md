# LeadFlow CRM

LeadFlow CRM is a PostgreSQL-backed sales workspace for growing teams that need a clean operating system for pipeline, follow-up work, and account visibility. The product is built with Next.js, Prisma, NextAuth, React, and Tailwind CSS and is designed to feel like a polished SaaS dashboard rather than a mock demo.

## What’s included

- Multi-tenant organization workspace
- Protected routes and secure credential-based login
- Dashboard metrics for leads, pipeline value, and conversion health
- Lead management with statuses, source, priority, and value tracking
- Follow-up task creation and completion workflows
- Reports page and team/account views
- Prisma schema ready for PostgreSQL persistence

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth credentials authentication
- Zod validation
- Vitest for automated regression tests

## Quick start

1. Install dependencies:
   npm install
2. Copy the environment template:
   cp .env.example .env
3. Update your local values in .env:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - NEXT_PUBLIC_APP_URL
4. Generate Prisma client and push the schema:
   npm run db:generate
   npm run db:push
5. Seed the demo workspace:
   npm run db:seed
6. Start the app:
   npm run dev

## Demo credentials

The default seed data creates a workspace with:

- Email: ava@leadflow.io
- Password: Password123!

## Useful commands

- npm run dev
- npm run dev:turbo
- npm run build
- npm run test
- npm run lint
- npm run db:generate
- npm run db:push
- npm run db:migrate
- npm run db:seed

## Demo walkthrough

A practical path through the app:

1. Sign in using the seeded owner account.
2. Open the dashboard to inspect the lead pipeline and conversion metrics.
3. Go to Leads and create a new opportunity using a realistic company and contact profile.
4. Update the lead status from New to Qualified or Proposal and verify the metrics reflect the change.
5. Open Tasks and create a follow-up task tied to the lead.
6. Visit Reports to review pipeline health and conversion summaries.
7. Use Contacts, Companies, and Teams pages to understand how the CRM scales across an organization.

## Project structure

- app/ — app routes and CRM UI
- lib/ — auth, validation, CRM service layer, dashboard metrics
- prisma/ — Prisma schema and seeded demo data
- types/ — NextAuth type extensions
