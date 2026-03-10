import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '../models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user || user.isBanned) return null;
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export const runtime = 'nodejs';
