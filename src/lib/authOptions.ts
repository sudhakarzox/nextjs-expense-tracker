import type { NextAuthOptions } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', 
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        console.log(`User logged in with Google: ${user.email}`);
        // Add your logging logic (e.g., DB insert) here
      }
    },
    async signOut({ token }) {
      console.log(`User logged out: ${token?.email}`);
      // Add your logging logic (e.g., DB insert) here
    },
  },
};
