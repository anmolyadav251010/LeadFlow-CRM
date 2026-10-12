import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getLeads } from '@/lib/crm-service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.organizationId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await getLeads(session.organizationId);
  return NextResponse.json({ data: leads });
}
