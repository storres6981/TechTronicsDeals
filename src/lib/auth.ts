import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Your providers configuration
  ],
  pages: {
    signIn: '/auth/signin',
    // other custom pages if you have them
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};