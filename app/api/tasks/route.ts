import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getTasks } from '@/lib/crm-service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.organizationId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await getTasks(session.organizationId);
  return NextResponse.json({ data: tasks });
}
