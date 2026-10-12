import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    organizationId?: string | null;
    role?: string | null;
  }

  interface User {
    id: string;
    organizationId?: string | null;
    role?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string | null;
    organizationId?: string | null;
    role?: string | null;
  }
}
