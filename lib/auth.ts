import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'leadflow-dev-secret',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? '';

        if (!email || !password) {
          throw new Error('Email and password are required.');
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: { include: { organization: true } },
          },
        });

        if (!user) {
          throw new Error('No account matches that email.');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
          throw new Error('Incorrect password.');
        }

        const membership = user.memberships[0];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          organizationId: membership?.organizationId ?? null,
          role: membership?.role ?? 'MEMBER',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.organizationId = (user as { organizationId?: string | null }).organizationId ?? null;
        token.role = (user as { role?: string }).role ?? 'MEMBER';
      }

      if (!token.organizationId && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: String(token.email) },
          include: { memberships: { include: { organization: true } } },
        });

        const membership = dbUser?.memberships[0];
        token.organizationId = membership?.organizationId ?? null;
        token.role = membership?.role ?? 'MEMBER';
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as typeof session.user & { id?: string };
        user.id = String(token.userId ?? session.user.email ?? '');
      }

      (session as typeof session & { organizationId?: string | null; role?: string }).organizationId = token.organizationId ?? null;
      (session as typeof session & { role?: string }).role = (token.role as string) ?? 'MEMBER';
      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}
